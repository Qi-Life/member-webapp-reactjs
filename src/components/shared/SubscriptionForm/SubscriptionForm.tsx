import React, { useEffect, useState } from 'react';
import img from '~/assets/img/subscription/subscription-images-rife.jpg';
import quantumImage from '~/assets/img/subscription/subscription-images-quantum.jpg';
import hQuantumImage from '~/assets/img/subscription/subscription-images-higher-quantum.jpg';
import RegularSilentQuantumImage from '~/assets/img/subscription/silent-quantum-regular-tier.png';
import ProSilentQuantumImage from '~/assets/img/subscription/silent-quantum-PRO-tier.png';
import adLifetimeImage from '~/assets/img/subscription/ad-lifetime.webp';
import innerCircleLifetimeImage from '~/assets/img/subscription/inner_circle_level2.webp';

import img1 from '~/assets/img/subscription/trusted-badge-1.png';
import img2 from '~/assets/img/subscription/trusted-badge-1.jpeg';
import img3 from '~/assets/img/subscription/jim-c.jpeg';

import { Stripe, loadStripe } from '@stripe/stripe-js';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { PaymentConfig } from './PaymentConfig';
import { getEmailUser, setUserAndPasswordLocal } from '~/helpers/token';
import { create_subscription } from '~/services/PaymentServices';
import LoadingButton from '~/components/LoadingButton';
import { toast } from 'react-toastify';
import BackImage from '~/assets/img/playlist/left.png';
import { getProfile } from '~/services/ProfileService';
import { trackFacebookEvent, trackFacebookEventCustom } from '~/helpers/fbq';

interface StripeOptions {
  mode: 'payment';
  amount: number;
  currency: string;
  paymentRequestButtonOptions?: {
    paymentRequest?: any;
  };
}

const getStripe = () => {
  let stripePromise;
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHER_KEY);
  }
  return stripePromise;
};

const CheckoutForm = (props: any) => {
  const elements = useElements();
  const stripe = useStripe();
  const [searchParams] = useSearchParams();
  const [userId, setUserId] = useState(localStorage.getItem('id_user'));
  const [userEmail, setUserEmail] = useState(getEmailUser());
  const [appName, setAppName] = useState('webapp');
  const [errorMessage, setErrorMessage] = useState(null);
  const paymentPlan = PaymentConfig[props.packageName];
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [cardholderName, setCardholderName] = useState('');

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (elements == null) {
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      return;
    }
    setLoading(true);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      elements,
      params: {
        billing_details: {
          name: cardholderName,
        },
      },
    });
    if (error) {
      alert(error?.message)
      setLoading(false)
      return
    }

    // Send the PaymentMethod ID and payment details to the backend
    let priceId = '';
    if (props.selectedTime === 'monthly') {
      priceId = paymentPlan.monthlyProductId;
    } else if (props.selectedTime === 'yearly') {
      priceId = paymentPlan.yearlyProductId;
    } else {
      priceId = paymentPlan.lifetimeProductId;
    }

    try {
      const res = await create_subscription({
        appName: searchParams.get("appName") || 'webapp',
        priceId,
        paymentMethodId: paymentMethod.id,
        packageName: props.packageName,
        selectedTime: props.selectedTime,
        userId: searchParams.get("userId") || userId,
        cardholderName,
        userEmail: searchParams.get("userEmail") ?? userEmail,
        type: props.selectedTime
      })
      setLoading(false);
      getProfile().then((userRes) => {
        setUserAndPasswordLocal(userRes.data)
      })
      navigate('/payment-success', { state: { gobackUrL: props.gobackUrl, appName, ...res.data } });
      trackFacebookEventCustom('purchase_success', {
        recurry: props.selectedTime,
        content_name: paymentPlan.text
      })
    } catch (error) {
      const err = error as { response: any };
      toast.error(err.response?.data?.data || 'Payment has error')
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='payment'>
      <div className="mb-4 focus:outline-none focus:border-p-colorPrimaryAlpha50 focus:ring-p-colorPrimaryAlpha50 focus:ring-opacity-50 focus:ring-2 p-Input--focused">
        <input
          disabled={!!userId}
          placeholder='Your email login'
          type="text"
          name="userEmail"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:border-p-colorPrimaryAlpha50 focus:ring-p-colorPrimaryAlpha50 focus:ring-opacity-50 focus:ring-2 p-Input--focused"
          required
        />
      </div>

      <div className="mb-4 focus:outline-none focus:border-p-colorPrimaryAlpha50 focus:ring-p-colorPrimaryAlpha50 focus:ring-opacity-50 focus:ring-2 p-Input--focused">
        <input
          placeholder='Cardholder name'
          type="text"
          id="cardholderName"
          name="cardholderName"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:border-p-colorPrimaryAlpha50 focus:ring-p-colorPrimaryAlpha50 focus:ring-opacity-50 focus:ring-2 p-Input--focused"
          required
        />
      </div>

      <div className="mb-4">
        {/* Place the CardElement component here */}
        <div className="p-3 border rounded-md w-full focus:outline-none focus:border-p-colorPrimaryAlpha50 focus:ring-p-colorPrimaryAlpha50 focus:ring-opacity-50 focus:ring-2 p-Input--focused">
          <CardElement
            options={{ hidePostalCode: true }}
          />
        </div>
      </div>
      {/* <ReCAPTCHA
        sitekey="6LexQTIpAAAAAL0JKmrXeVcUPkNefB5JZ4s3ShbE"
      /> */}
      <button
        type="submit"
        disabled={!stripe || !elements || loading}
        className="w-full bg-[#059f83] text-white rounded-full px-4 py-4 font-bold mt-4"
      >
        Join Now
      </button>

      {loading && <LoadingButton />}
      {/* Show error message to your customers */}
      {errorMessage && <div>{errorMessage}</div>}

    </form>
  );
};

function SubscriptionForm(props: any) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const packageName = searchParams.get('paymentPlan');
  const [paymentPlan, setPaymentPlan] = useState(PaymentConfig[packageName] || PaymentConfig.rifePlan);

  const [selectedTime, setSelectedTime] = useState(searchParams.get("recurry") || 'monthly');
  const [isPayment, setIsPayment] = useState(false);

  const handlePlanChange = (plan: any) => {
    setSelectedTime(plan);
  };

  let mode = 'payment' as const;
  const options: StripeOptions = {
    mode: mode,
    amount: 1099,
    currency: 'usd',
    paymentRequestButtonOptions: {
      // Disable Google Pay
      paymentRequest: null,
    },
  };

  const handleGoBack = () => {
    const appName = searchParams.get("appName") || 'webapp';
    if (appName != 'rc_app') {
      navigate(-1)
    } else {
      confirm("Back");
    }
  };

  useEffect(() => {
    const userCategoryArr = localStorage.getItem('category_ids')
    if (userCategoryArr && userCategoryArr.split(',').map(item => +item).includes(paymentPlan.categoryId)) {
      setIsPayment(true)
    }
  }, [paymentPlan])


  const getPlanImage = () => {
    if (packageName == 'silentQuantumPlan') {
      return RegularSilentQuantumImage
    } else if (packageName == 'silentQuantumProPlan') {
      return ProSilentQuantumImage
    }
    else if (packageName == 'quantumPlan') {
      return quantumImage
    } else if (packageName == 'rifePlan') {
      return img
    } else if (packageName == 'higherQuantumPlan') {
      return hQuantumImage
    } else if (packageName == 'advancedQuantumLifetime') {
      return adLifetimeImage
    } else if (packageName == 'innerCircleLifetime') {
      return innerCircleLifetimeImage
    }
    return quantumImage
  }

  return (
    <div className="flex flex-col items-center bg-white px-3">

      {isPayment ? <h3 className='mt-40 mb-20 text-green-600 font-bold text-lg'>You already purchased this subscription!
      </h3> :
        <div className="mt-40 xs:w-[90%] sm:w-[510px] relative">
          <div className='absolute left-[-20px] top-[-50px]'>
            <div onClick={handleGoBack} className="border border-black p-1.5 rounded-md shadow-md cursor-pointer inline-block">
              <img className="object-cover" src={BackImage} alt="" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-center">{paymentPlan.description}</h3>
          <img src={getPlanImage()} alt="" className=" w-[200px] m-auto my-[20px]" />
          {!paymentPlan.lifetimeProductId && (
            <div className="border border-black border-solid rounded-full flex h-[50px]">
              <button
                type="button"
                className={`w-1/2 ${selectedTime === 'monthly' ? 'bg-[#059f83] text-white rounded-full px-4 py-2 font-bold' : ''
                  }`}
                onClick={() => handlePlanChange('monthly')}
              >
                Monthly
              </button>
              <button
                type="button"
                className={`w-1/2 ${selectedTime === 'yearly' ? 'bg-[#059f83] text-white rounded-full px-4 py-2 font-bold' : ''
                  }`}
                onClick={() => handlePlanChange('yearly')}
              >
                Yearly
                <span className="bg-red-500 text-white text-center rounded-lg text-xs p-1 pl-2 pr-2 ml-4">
                  Save UpTo ${paymentPlan.saveAmount}
                </span>
              </button>
            </div>
          )}

          <div className="border border-black border-solid rounded-lg mt-[20px] p-1.5">
            {!paymentPlan.lifetimeProductId ? (
              <h3 className="text-2xl text-center mb-2">
                $
                <span className="mb-2">
                  {selectedTime === 'monthly' ? `${paymentPlan.monthlyAmount} / mo` : `${paymentPlan.amount} / mo`}
                </span>
              </h3>
            ) : (
              <h3 className="text-2xl text-center mb-2">
                $<span className="mb-2">{`${paymentPlan.yealyAmount} / one time purchase`}</span>
              </h3>
            )}
            <p className={`text-sm text-center mb-2 ${selectedTime === 'monthly' ? 'hidden' : ''}`}>
              <b>
                <span>${paymentPlan.yealyAmount} billed annually</span>
              </b>
            </p>
            <p className="text-sm text-center">
              <b>Prices in USD.</b>
            </p>
          </div>

          <div className="mt-10 mb-4">
            <Elements stripe={getStripe()} options={options}>
              <CheckoutForm packageName={packageName} selectedTime={paymentPlan.lifetimeProductId ? 'onetime' : selectedTime} gobackUrl={props.gobackUrl} />
            </Elements>
            <div className="pmpro_submit second text-center">
              <div className="p-4">
                <img src={img1} width="300" className="m-auto" />
              </div>
              <div className="p-4">
                <img src={img2} width="300" className="m-auto" />
              </div>

              <p className="text-base">
                By placing your order you agree to the terms of use{' '}
                <a
                  className="checkout-link"
                  rel="noopener"
                  style={{ color: '#a7a7a7', textDecoration: 'underline' }}
                  href="https://qilife.io/members/terms-of-use.php"
                  target="_blank"
                >
                  here
                </a>
              </p>
            </div>
            <hr className="my-5 border-t border-gray-300" />
            <div className="flex">
              <div className="w-[25%]">
                <img src={img3} alt="Hallie Cowan" className="rounded-full w-full" />
              </div>

              <div className="w-[75%] pl-5 text-base">
                <p className="">
                  I eliminated a daunting amount debt with Qi Coils &amp; Inner Circle Frequencies. My mental energy
                  became different completely after using this Qi Coil
                </p>
                <span className="font-bold">Jim C,</span> Qi Coil App User
              </div>
            </div>
          </div>
        </div>}
    </div>
  );
}

export default SubscriptionForm;
