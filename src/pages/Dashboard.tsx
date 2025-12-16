import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useTransactions } from "../hooks/useTransactions";

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { transactions, loading } = useTransactions(user?.id);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Bem-vindo, {user?.email}</p>
      <button onClick={handleSignOut} className="btn btn-primary">
        Sign Out
      </button>
      <h2 className="text-xl mt-4">Transações</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="list-disc pl-5">
          {transactions.map((t) => (
            <li key={t.id}>
              {t.date} - {t.description} - R$ {t.amount}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
