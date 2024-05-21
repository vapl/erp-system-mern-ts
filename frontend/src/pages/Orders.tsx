import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import PageTitle from '../components/PageTitle';
import TableOrders from '../components/Tables/TableOrders';


const Orders = () => {
  return (
    <>
      <PageTitle title="Orders" />
      <Breadcrumb pageName="Orders" />
      <div className="flex flex-col gap-10">
          <TableOrders />
      </div>
    </>
  );
};

export default Orders;
