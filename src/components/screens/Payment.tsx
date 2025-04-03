import Head from '~/components/shared/Head';
import SubscriptionForm from '~/components/shared/SubscriptionForm/SubscriptionForm';
import { useLocation } from 'react-router-dom';

function PaymentScreen() {
  const { state } = useLocation();
  const { gobackUrl }: any = state ?? {}
  return (
    <>
      <Head title="Payment" />
      <SubscriptionForm gobackUrl={gobackUrl} />
    </>
  );
}

export default PaymentScreen;
