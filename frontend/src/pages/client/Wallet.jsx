import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Wallet2,
  TrendingUp,
  CreditCard,
  X,
  Loader2,
  ArrowDownToLine,
  CheckCircle2,
  XCircle,
  ReceiptText,
} from "lucide-react";
import toast from "react-hot-toast";
import StatCard from "../../components/ui/StatCard";
import { getWallet, getTransactions, deposit } from "../../api/wallet";

const formatVND = (amount) => `$${new Intl.NumberFormat("vi-VN").format(amount ?? 0)}`;

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const STATUS_STYLES = {
  SUCCESS: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  FAILED: "bg-red-100 text-red-700",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
        STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status === "SUCCESS" && <CheckCircle2 size={11} />}
      {status === "PENDING" && <Loader2 size={11} className="animate-spin" />}
      {status === "FAILED" && <XCircle size={11} />}
      {status}
    </span>
  );
}

function DepositModal({ onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const PRESETS = [50000, 100000, 200000, 500000, 1000000, 2000000];

  const handleDeposit = async () => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount < 10000) {
      toast.error("Minimum deposit is 10,000 VND");
      return;
    }
    if (numAmount > 50000000) {
      toast.error("Maximum deposit is 50,000,000 VND");
      return;
    }
    setSubmitting(true);
    try {
      const result = await deposit(numAmount);
      window.location.href = result.paymentUrl;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create payment link");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center">
              <ArrowDownToLine size={20} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#1a1a3c]">Top Up Wallet</h2>
              <p className="text-xs text-gray-400 mt-0.5">Pay securely via VNPay</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Amount input */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Amount (VND)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
            <input
              ref={inputRef}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleDeposit()}
              placeholder="Enter amount..."
              className="w-full pl-8 pr-4 py-3.5 border border-gray-200 rounded-xl text-[#1a1a3c] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            Min: {formatVND(10000)} · Max: {formatVND(50000000)}
          </p>
        </div>

        {/* Preset amounts */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => setAmount(String(preset))}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                Number(amount) === preset
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-500"
              }`}
            >
              {new Intl.NumberFormat("vi-VN").format(preset)}
            </button>
          ))}
        </div>

        {/* VNPay button */}
        <button
          onClick={handleDeposit}
          disabled={submitting || !amount}
          className="w-full flex items-center justify-center gap-2.5 py-4 bg-[#1a1a3c] hover:bg-orange-500 text-white font-black rounded-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 shadow-md"
        >
          {submitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <CreditCard size={18} />
          )}
          {submitting ? "Redirecting to VNPay..." : "Deposit via VNPay"}
        </button>

        <p className="text-center text-xs text-gray-400 mt-3">
          You will be redirected to VNPay Sandbox to complete payment
        </p>
      </div>
    </div>
  );
}

export default function WalletPage() {
  const [searchParams] = useSearchParams();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const statusHandled = useRef(false);

  const fetchWallet = () =>
    getWallet()
      .then(setWallet)
      .catch(() => toast.error("Failed to load wallet"));

  const fetchTransactions = (page = 0) => {
    setTxLoading(true);
    return getTransactions(page, pagination.size)
      .then((data) => {
        setTransactions(data.content ?? []);
        setPagination((prev) => ({
          ...prev,
          page: data.number ?? 0,
          totalPages: data.totalPages ?? 0,
          totalElements: data.totalElements ?? 0,
        }));
      })
      .catch(() => toast.error("Failed to load transactions"))
      .finally(() => setTxLoading(false));
  };

  useEffect(() => {
    Promise.all([fetchWallet(), fetchTransactions(0)]).finally(() => setLoading(false));
  }, []);

  // Handle VNPay return status
  useEffect(() => {
    if (statusHandled.current) return;
    const status = searchParams.get("status");
    if (status === "success") {
      statusHandled.current = true;
      toast.success("Deposit successful! Your balance has been updated.");
      fetchWallet();
      fetchTransactions(0);
    } else if (status === "failed") {
      statusHandled.current = true;
      toast.error("Deposit failed. Please try again.");
    }
  }, [searchParams]);

  const handlePageChange = (newPage) => {
    if (newPage < 0 || newPage >= pagination.totalPages) return;
    fetchTransactions(newPage);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  const statsData = [
    {
      id: "balance",
      label: "Current Balance",
      value: formatVND(wallet?.balance),
      icon: Wallet2,
      iconBgColor: "bg-orange-50",
      iconTextColor: "text-orange-600",
      subtext: <p className="text-xs text-gray-400">Available in your wallet</p>,
    },
    {
      id: "total-tx",
      label: "Total Transactions",
      value: String(wallet?.totalTransactions ?? 0),
      icon: TrendingUp,
      iconBgColor: "bg-gray-50",
      iconTextColor: "text-gray-600",
      subtext: <p className="text-xs text-gray-400">All time deposits</p>,
    },
    {
      id: "method",
      label: "Payment Method",
      value: "VNPay",
      icon: CreditCard,
      iconBgColor: "bg-orange-50",
      iconTextColor: "text-orange-600",
      subtext: <p className="text-xs text-gray-400">Supported gateway</p>,
    },
  ];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-12">
      {depositOpen && (
        <DepositModal
          onClose={() => setDepositOpen(false)}
          onSuccess={() => {
            setDepositOpen(false);
            fetchWallet();
            fetchTransactions(0);
          }}
        />
      )}

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1a1a3c]">My Wallet</h1>
          <p className="text-gray-500 mt-1">
            Manage your balance and transaction history
          </p>
        </div>
        <button
          onClick={() => setDepositOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-md text-sm"
        >
          <ArrowDownToLine size={16} />
          Top Up Wallet
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsData.map((card) => (
          <StatCard
            key={card.id}
            label={card.label}
            value={card.value}
            icon={card.icon}
            iconBgColor={card.iconBgColor}
            iconTextColor={card.iconTextColor}
            subtext={card.subtext}
          />
        ))}
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <ReceiptText size={18} className="text-orange-500" />
            <h3 className="font-bold text-[#1a1a3c] uppercase tracking-wider text-xs">
              Transaction History
            </h3>
          </div>
          <span className="text-xs text-gray-400 font-semibold">
            {pagination.totalElements} total
          </span>
        </div>

        {txLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 size={24} className="animate-spin text-orange-500" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
              <ReceiptText size={24} className="text-orange-400" />
            </div>
            <h4 className="font-bold text-[#1a1a3c] mb-1">No transactions yet</h4>
            <p className="text-sm text-gray-400">
              Top up your wallet to get started
            </p>
            <button
              onClick={() => setDepositOpen(true)}
              className="mt-5 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl transition-all"
            >
              Top Up Now
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    {["Date", "Amount", "Type", "Status", "Payment Method", "Reference"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, idx) => (
                    <tr
                      key={tx.id}
                      className={`border-b border-gray-50 hover:bg-gray-50/60 transition-colors ${
                        idx % 2 === 0 ? "" : "bg-gray-50/30"
                      }`}
                    >
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-xs">
                        {formatDate(tx.createdAt)}
                      </td>
                      <td className="px-6 py-4 font-bold text-[#1a1a3c] whitespace-nowrap">
                        {formatVND(tx.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                        {tx.paymentMethod}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[11px] font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
                          {tx.vnpTxnRef ?? tx.transactionCode ?? "-"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50">
                <p className="text-xs text-gray-400">
                  Page {pagination.page + 1} of {pagination.totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 0}
                    className="px-4 py-2 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Previous
                  </button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i)
                    .filter(
                      (p) =>
                        p === 0 ||
                        p === pagination.totalPages - 1 ||
                        Math.abs(p - pagination.page) <= 1
                    )
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === "..." ? (
                        <span key={`ellipsis-${idx}`} className="text-gray-400 text-xs px-1">
                          …
                        </span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => handlePageChange(item)}
                          className={`w-8 h-8 text-xs font-bold rounded-xl transition-all ${
                            item === pagination.page
                              ? "bg-orange-500 text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                          }`}
                        >
                          {item + 1}
                        </button>
                      )
                    )}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages - 1}
                    className="px-4 py-2 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
