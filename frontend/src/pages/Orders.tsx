import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import PageTitle from '../components/PageTitle';
import TableOrders from '../components/Tables/TableOrders';
import DefaultLayout from '../layout/DefaultLayout';


const Orders = () => {
  return (
    <>
    <DefaultLayout>
      <PageTitle title="Orders" />
      <Breadcrumb pageName="Orders" />
      <div className="flex flex-col gap-10">
          <TableOrders />
      </div>
    </DefaultLayout>
    </>
  );
};

export default Orders;
