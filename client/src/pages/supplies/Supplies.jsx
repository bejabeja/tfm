import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { IoAddOutline, IoBagCheckOutline, IoCartOutline, IoPencilOutline, IoRefreshOutline, IoTrashOutline } from "react-icons/io5";
import { supplyCategories, supplyUnits } from "@tobeatraveller/shared";
import Modal from "../../components/modal/Modal";
import {
  addShoppingListItem, deleteInventoryItem, deleteShoppingListItem, getInventory, getShoppingList,
  markInventoryItemUsedUp, markShoppingListItemPurchased, updateInventoryItem, updateShoppingListItem,
} from "../../services/supplies";
import SupplyFormModal from "./SupplyFormModal";
import "./Supplies.scss";

const Supplies = () => {
  const { t } = useTranslation();
  const s = (key, vars) => t(`supplies.${key}`, vars);

  const [tab, setTab] = useState("shopping");
  const [shoppingList, setShoppingList] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formTarget, setFormTarget] = useState(null); // { mode: 'add' | 'edit-shopping' | 'edit-inventory', item? }
  const [deleteTarget, setDeleteTarget] = useState(null); // { mode, id }
  const [deleting, setDeleting] = useState(false);
  const [purchaseTarget, setPurchaseTarget] = useState(null); // shopping list item being purchased
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [purchasing, setPurchasing] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([getShoppingList(), getInventory()])
      .then(([shoppingRes, inventoryRes]) => {
        setShoppingList(shoppingRes);
        setInventory(inventoryRes);
        setError(null);
      })
      .catch((err) => setError(err.message || "An error occurred"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const categoryLabel = (value) => {
    const fallback = supplyCategories.find(c => c.value === value)?.label ?? value;
    return s(`category.${value}`, fallback);
  };

  const closeForm = () => setFormTarget(null);

  const handleSave = async (data) => {
    if (formTarget.mode === "add") {
      await addShoppingListItem(data);
      toast.success(s("added"));
    } else if (formTarget.mode === "edit-shopping") {
      await updateShoppingListItem(formTarget.item.id, data);
      toast.success(s("updated"));
    } else {
      await updateInventoryItem(formTarget.item.id, data);
      toast.success(s("updated"));
    }
    closeForm();
    loadData();
  };

  const openPurchase = (item) => {
    setPurchaseTarget(item);
    setPurchaseAmount(String(item.amount));
  };

  const confirmPurchase = async () => {
    const amount = parseFloat(purchaseAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error(s("invalidAmount"));
      return;
    }
    setPurchasing(true);
    try {
      await markShoppingListItemPurchased(purchaseTarget.id, amount);
      toast.success(s("movedToInventory", { name: purchaseTarget.name }));
      setPurchaseTarget(null);
      loadData();
    } catch (err) {
      toast.error(err.message || s("saveError"));
    } finally {
      setPurchasing(false);
    }
  };

  const purchaseUnitAllowsDecimals = purchaseTarget
    ? supplyUnits.find(u => u.value === purchaseTarget.unit)?.allowsDecimals ?? true
    : true;
  const purchaseStep = purchaseUnitAllowsDecimals ? "0.01" : "1";

  const handleUsedUp = async (item) => {
    try {
      await markInventoryItemUsedUp(item.id);
      toast.success(s("movedToShoppingList", { name: item.name }));
      loadData();
    } catch (err) {
      toast.error(err.message || s("saveError"));
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      if (deleteTarget.mode === "shopping") await deleteShoppingListItem(deleteTarget.id);
      else await deleteInventoryItem(deleteTarget.id);
      toast.success(s("deleted"));
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      toast.error(err.message || s("deleteError"));
    } finally {
      setDeleting(false);
    }
  };

  if (error) {
    return (
      <section className="section__container">
        <p className="error-message">{s("errorMsg")}</p>
      </section>
    );
  }

  const items = tab === "shopping" ? shoppingList : inventory;

  const knownItems = Object.values(
    [...inventory, ...shoppingList].reduce((byKey, current) => {
      const key = `${current.name.toLowerCase()}|${current.unit}`;
      if (!byKey[key]) byKey[key] = { name: current.name, unit: current.unit, category: current.category };
      return byKey;
    }, {})
  );

  return (
    <section className="supplies section__container">
      <div className="supplies__header">
        <h1 className="supplies__title">{s("title")}</h1>
        {tab === "shopping" && (
          <button type="button" className="btn btn--primary" onClick={() => setFormTarget({ mode: "add" })}>
            <IoAddOutline /> {s("addItem")}
          </button>
        )}
      </div>

      <div className="supplies__tabs">
        <button
          type="button"
          className={`supplies__tab ${tab === "shopping" ? "supplies__tab--active" : ""}`}
          onClick={() => setTab("shopping")}
        >
          <IoCartOutline /> {s("shoppingListTab")}
          {shoppingList.length > 0 && <span className="supplies__tab-count">{shoppingList.length}</span>}
        </button>
        <button
          type="button"
          className={`supplies__tab ${tab === "inventory" ? "supplies__tab--active" : ""}`}
          onClick={() => setTab("inventory")}
        >
          <IoBagCheckOutline /> {s("inventoryTab")}
          {inventory.length > 0 && <span className="supplies__tab-count">{inventory.length}</span>}
        </button>
      </div>

      {loading ? (
        <div className="supplies__list">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton supplies__item-skeleton" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="supplies__empty">
          <p>{tab === "shopping" ? s("noShoppingItems") : s("noInventoryItems")}</p>
        </div>
      ) : (
        <div className="supplies__list">
          {items.map((item) => (
            <div key={item.id} className="supplies__item">
              <div className="supplies__item-main">
                <span className="supplies__item-category">{categoryLabel(item.category)}</span>
                <span className="supplies__item-name">{item.name}</span>
                <span className="supplies__item-amount">{item.amount} {s(`unit.${item.unit}`, item.unit)}</span>
                {item.notes && <p className="supplies__item-notes">{item.notes}</p>}
              </div>
              <div className="supplies__item-actions">
                {tab === "shopping" ? (
                  <button type="button" className="supplies__item-action-btn supplies__item-action-btn--primary" onClick={() => openPurchase(item)} title={s("markPurchased")}>
                    <IoBagCheckOutline />
                  </button>
                ) : (
                  <button type="button" className="supplies__item-action-btn supplies__item-action-btn--primary" onClick={() => handleUsedUp(item)} title={s("markUsedUp")}>
                    <IoRefreshOutline />
                  </button>
                )}
                <button
                  type="button"
                  className="supplies__item-action-btn"
                  onClick={() => setFormTarget({ mode: tab === "shopping" ? "edit-shopping" : "edit-inventory", item })}
                  aria-label={t("common.edit")}
                >
                  <IoPencilOutline />
                </button>
                <button
                  type="button"
                  className="supplies__item-action-btn"
                  onClick={() => setDeleteTarget({ mode: tab, id: item.id })}
                  aria-label={t("common.delete")}
                >
                  <IoTrashOutline />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formTarget && (
        <SupplyFormModal
          item={formTarget.item}
          title={formTarget.mode === "add" ? s("addItem") : s("editItem")}
          saveLabel={formTarget.mode === "add" ? s("addItem") : t("common.save")}
          existingItems={knownItems}
          onClose={closeForm}
          onSave={handleSave}
        />
      )}

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title={s("deleteConfirmTitle")}
        description={s("deleteConfirmDesc")}
        type="danger"
        loading={deleting}
      />

      {purchaseTarget && (
        <div className="supplies__purchase-backdrop" onClick={() => setPurchaseTarget(null)}>
          <div className="supplies__purchase-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h2>{s("purchaseTitle", { name: purchaseTarget.name })}</h2>
            <p className="supplies__purchase-hint">{s("purchaseHint", { amount: purchaseTarget.amount, unit: s(`unit.${purchaseTarget.unit}`, purchaseTarget.unit) })}</p>
            <label htmlFor="purchase-amount" className="input__label">{s("amountLabel")}</label>
            <input
              id="purchase-amount"
              type="number"
              className="input__field"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(e.target.value)}
              step={purchaseStep}
              min={purchaseStep}
              autoFocus
            />
            <div className="supplies__purchase-actions">
              <button type="button" className="btn btn--ghost" onClick={() => setPurchaseTarget(null)}>
                {t("common.cancel")}
              </button>
              <button type="button" className="btn btn--primary" onClick={confirmPurchase} disabled={purchasing}>
                {purchasing ? t("common.loading") : s("confirmPurchase")}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Supplies;
