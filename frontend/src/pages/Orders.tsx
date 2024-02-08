import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TableOrders from '../components/Tables/TableOrders';
import DefaultLayout from '../layout/DefaultLayout';

const Orders = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Orders" />

      <div className="flex flex-col gap-10">
        <TableOrders />
      </div>
    </DefaultLayout>
  );
};

export default Orders;
