// ============================================================
// SUSHI DEMURE — Order cart state (shared across Hero, Menu, panel)
// ============================================================

const OrderCartContext = React.createContext(null);

function OrderCartProvider({ children }) {
  const [lines, setLines] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  const addToCart = React.useCallback((item) => {
    if (!item || item.id == null) return;
    setLines((prev) => {
      const i = prev.findIndex((l) => l.id === item.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + 1 };
        return next;
      }
      return [
        ...prev,
        {
          id: item.id,
          nameEn: item.nameEn,
          nameAr: item.nameAr,
          price: Number(item.price) || 0,
          qty: 1,
        },
      ];
    });
  }, []);

  const setQty = React.useCallback((id, qty) => {
    const q = Math.max(0, parseInt(String(qty), 10) || 0);
    setLines((prev) => {
      if (q <= 0) return prev.filter((l) => l.id !== id);
      return prev.map((l) => (l.id === id ? { ...l, qty: q } : l));
    });
  }, []);

  const inc = React.useCallback((id) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)));
  }, []);

  const dec = React.useCallback((id) => {
    setLines((prev) => prev
      .map((l) => (l.id === id ? { ...l, qty: l.qty - 1 } : l))
      .filter((l) => l.qty > 0));
  }, []);

  const removeLine = React.useCallback((id) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clearCart = React.useCallback(() => {
    setLines([]);
  }, []);

  const cartCount = React.useMemo(
    () => lines.reduce((s, l) => s + l.qty, 0),
    [lines],
  );
  const cartTotal = React.useMemo(
    () => lines.reduce((s, l) => s + l.price * l.qty, 0),
    [lines],
  );

  const buildItemsString = React.useCallback(
    () => lines.map((l) => `${l.qty} ${l.nameEn}`).join(', '),
    [lines],
  );

  const value = React.useMemo(
    () => ({
      lines,
      addToCart,
      setQty,
      inc,
      dec,
      removeLine,
      clearCart,
      open,
      setOpen,
      cartCount,
      cartTotal,
      buildItemsString,
    }),
    [
      lines,
      addToCart,
      setQty,
      inc,
      dec,
      removeLine,
      clearCart,
      open,
      cartCount,
      cartTotal,
      buildItemsString,
    ],
  );

  return (
    <OrderCartContext.Provider value={value}>
      {children}
    </OrderCartContext.Provider>
  );
}

function useOrderCart() {
  const ctx = React.useContext(OrderCartContext);
  if (!ctx) {
    throw new Error('useOrderCart must be used inside OrderCartProvider');
  }
  return ctx;
}

Object.assign(window, { OrderCartContext, OrderCartProvider, useOrderCart });
