import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Lock, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TableCard } from '../TableCard';

const TableGridSection: React.FC = () => {
  const navigate = useNavigate();
  const { totalTables, getTableStatus, getTableOrder, getTableOccupiedAt, switchTable } = useApp();

  const tables = Array.from({ length: totalTables }, (_, i) => String(i + 1));

  const handleTableSelect = (tableNum: string) => {
    const status = getTableStatus(tableNum);
    if (status === 'occupied') return;
    switchTable(tableNum);
    navigate(`/menu?table=${tableNum}`);
  };

  return (
    <section className="py-20 bg-brand-cream dark:bg-brand-dark-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-emerald/10 dark:bg-brand-amber/10 px-4 py-1.5 rounded-full mb-4">
            <UtensilsCrossed size={16} className="text-brand-emerald dark:text-brand-amber" />
            <span className="text-xs font-bold text-brand-emerald dark:text-brand-amber uppercase tracking-wider">
              Choose Your Table
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white font-brand-serif">
            Select Your Table
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 max-w-md mx-auto">
            Choose from our available tables and start your tea journey. Occupied tables are locked for other customers.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {tables.map((tNum) => {
            const status = getTableStatus(tNum);
            const order = getTableOrder(tNum);
            const occupiedAt = getTableOccupiedAt(tNum);
            const isOccupied = status === 'occupied';

            return (
              <motion.div
                key={tNum}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: parseInt(tNum) * 0.02 }}
              >
                <TableCard
                  tableNumber={tNum}
                  status={status}
                  orderId={order?.id || null}
                  occupiedAt={occupiedAt}
                  order={order}
                  onSelect={() => handleTableSelect(tNum)}
                  compact
                />
              </motion.div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-6 mt-10 text-xs font-semibold text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
            Available
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
            Occupied
          </div>
        </div>
      </div>
    </section>
  );
};

export { TableGridSection };