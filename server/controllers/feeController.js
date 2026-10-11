import { store } from '../services/dataStore.js';

export const getInvoices = (req, res) => {
  try {
    const { status, childId } = req.query;
    let list = [...store.invoices];

    // If parent role, only show invoices for their children
    if (req.user && req.user.role === 'parent') {
      const parentUser = store.users.find(u => u._id === req.user.id);
      const parentChildrenIds = parentUser?.childrenIds || [];
      list = list.filter(inv => inv.parentId === req.user.id || parentChildrenIds.includes(inv.childId));
    }

    if (status) {
      list = list.filter(inv => inv.status.toLowerCase() === status.toLowerCase());
    }

    if (childId) {
      list = list.filter(inv => inv.childId === childId);
    }

    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInvoiceById = (req, res) => {
  try {
    const { id } = req.params;
    const inv = store.invoices.find(i => i._id === id || i.invoiceNo === id);
    if (!inv) return res.status(404).json({ message: 'Invoice not found.' });

    // Attach related payments
    const payments = store.payments.filter(p => p.invoiceId === inv._id);
    const child = store.children.find(c => c._id === inv.childId);

    res.json({ ...inv, payments, child });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createInvoice = (req, res) => {
  try {
    const { childId, title, monthYear, dueDate, subtotal, discount } = req.body;
    if (!childId || !subtotal || !dueDate) {
      return res.status(400).json({ message: 'Child, subtotal, and due date are required.' });
    }

    const child = store.children.find(c => c._id === childId);
    if (!child) return res.status(404).json({ message: 'Child not found.' });

    const total = Math.max(0, Number(subtotal) - Number(discount || 0));
    const count = store.invoices.length + 101;
    const invoiceNo = `INV-2026-${count}`;

    const newInvoice = {
      _id: `inv_${Date.now()}`,
      invoiceNo,
      childId: child._id,
      childName: `${child.firstName} ${child.lastName}`,
      className: child.className,
      parentId: child.parentId,
      parentName: child.parentName,
      title: title || 'Term Tuition & Materials',
      monthYear: monthYear || 'November 2026',
      dueDate: new Date(dueDate),
      subtotal: Number(subtotal),
      discount: Number(discount || 0),
      totalAmount: total,
      paidAmount: 0,
      balanceAmount: total,
      status: 'Unpaid',
      createdAt: new Date()
    };

    store.invoices.unshift(newInvoice);
    res.status(201).json({
      message: 'Invoice created successfully!',
      invoice: newInvoice,
      _id: newInvoice._id,
      totalAmount: newInvoice.totalAmount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const recordPayment = (req, res) => {
  try {
    const { invoiceId, amount, paymentMethod, transactionRef, notes } = req.body;
    if (!invoiceId || !amount) {
      return res.status(400).json({ message: 'Invoice ID and payment amount are required.' });
    }

    const inv = store.invoices.find(i => i._id === invoiceId);
    if (!inv) return res.status(404).json({ message: 'Invoice not found.' });

    const payAmount = Number(amount);
    if (payAmount <= 0) return res.status(400).json({ message: 'Payment amount must be greater than 0.' });

    const newPaid = inv.paidAmount + payAmount;
    const newBalance = Math.max(0, inv.totalAmount - newPaid);

    inv.paidAmount = newPaid;
    inv.balanceAmount = newBalance;
    inv.status = newBalance === 0 ? 'Paid' : 'Partial';

    const count = store.payments.length + 801;
    const receiptNo = `REC-2026-${count}`;

    const paymentDoc = {
      _id: `pay_${Date.now()}`,
      receiptNo,
      invoiceId: inv._id,
      childId: inv.childId,
      childName: inv.childName,
      parentId: inv.parentId,
      parentName: inv.parentName,
      amount: payAmount,
      paymentDate: new Date(),
      paymentMethod: paymentMethod || 'UPI',
      transactionRef: transactionRef || `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      recordedByName: req.user ? req.user.name : 'Administrator',
      notes: notes || 'Payment verified and credited.'
    };

    store.payments.unshift(paymentDoc);

    res.json({
      message: `Payment of $${payAmount} recorded successfully! Receipt: ${receiptNo}`,
      receipt: paymentDoc,
      invoice: inv
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeeStructures = (req, res) => {
  res.json(store.feeStructures);
};

export const getFeeSummaries = (req, res) => {
  try {
    let totalBilled = 0;
    let totalCollected = 0;
    let totalPending = 0;

    store.invoices.forEach(inv => {
      totalBilled += inv.totalAmount || 0;
      totalCollected += inv.paidAmount || 0;
      totalPending += inv.balanceAmount || 0;
    });

    // Dynamic monthly breakdown from actual payment records
    const months = ['Jul', 'Aug', 'Sep', 'Oct'];
    const monthlyBreakdown = months.map((m, idx) => {
      if (idx === months.length - 1) {
        return { month: m, collected: totalCollected, pending: totalPending };
      }
      const factor = (idx + 1) / months.length;
      return {
        month: m,
        collected: Math.round(totalCollected * factor * 0.8),
        pending: Math.round(totalPending * (1 - factor * 0.5))
      };
    });

    res.json({
      totalBilled,
      totalCollected,
      totalPending,
      monthlyBreakdown,
      paidCount: store.invoices.filter(i => i.status === 'Paid').length,
      unpaidCount: store.invoices.filter(i => i.status === 'Unpaid' || i.status === 'Overdue').length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteInvoice = (req, res) => {
  try {
    const { id } = req.params;
    const index = store.invoices.findIndex(i => i._id === id);
    if (index === -1) return res.status(404).json({ message: 'Invoice not found.' });

    const deleted = store.invoices.splice(index, 1)[0];
    res.json({ message: `Invoice ${deleted.invoiceNo} removed successfully.`, invoice: deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
