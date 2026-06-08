import React from "react";
import CustomersHeader from "./Components/CustomersHeader";
import CustomersStatesRow from "./Components/CustomersStatesRow";
import CustomersHighlight from "./Components/CustomersHighlight";
import CustomersCharts from "./Components/CustomersCharts";
import CustomersList from "./Components/CustomersList";

const Customers: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <CustomersHeader />

      {/* Stats Row */}
      <CustomersStatesRow />

      {/* Top 3 Customers Highlight */}
      <CustomersHighlight />

      {/* Charts Row */}
      <CustomersCharts />

      {/* Customer List Section */}
      <CustomersList />
    </div>
  );
};

export default Customers;
