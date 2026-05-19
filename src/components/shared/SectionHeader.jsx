import React from 'react';
import { motion } from 'framer-motion';

export default function SectionHeader({ title, subtitle, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-end justify-between mb-6"
    >
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold font-heading">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  );
}