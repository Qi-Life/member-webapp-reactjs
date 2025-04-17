import React, { FormEvent, useState, useContext } from 'react';
// import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';
import Head from '../shared/Head';
import { loginUser, registerUser } from '../../services/AuthServices';
import { AppContext } from '../context/AppProvider';
import LoadingButton from '../LoadingButton';
import { setAccessToken, setUserAndPasswordLocal } from '~/helpers/token';
import { trackFacebookEvent } from '~/helpers/fbq';
import { validateEmail } from '~/helpers/util';

import freeFrequencyBundles from '../../assets/img/image/free_frequency_bundles.png';
import { RegisterType } from '~/interface/auth.interface';
import { toast } from 'react-toastify';

const registerData: RegisterType = {
    name: '',
    email: '',
    password: '',
};

export default function Register() {
    const navigate = useNavigate();
    const [inforRegister, setInforRegister] = useState({ name: '', email: '', password: '' });
    const { loading, setLoading } = useContext(AppContext);
    const [errs, setErrors] = useState<RegisterType>(registerData);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);


    const validateForm = (values: Partial<RegisterType>) => {
        const newErrors = { ...errs };
        if ('name' in values) {
            newErrors.name = values?.name?.length ? '' : 'Name is required';
        }
        if ('email' in values) {
            newErrors.email = validateEmail(values.email || '') ? '' : 'Email invalid';
        }
        if ('password' in values) {
            newErrors.password = !values.password?.length ? 'Password is required' : values.password?.length < 8 ? 'Password must be at least 8 characters' : '';
        }
        setErrors(newErrors);
    };


    const handleChangeInput = (e: any) => {
        const { name, value } = e.target;
        setInforRegister({ ...inforRegister, [name]: value.trim() });
        validateForm({ [name]: value })
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const registerResponse = await registerUser({ name, email, password });
            setLoading(false);
            if (registerResponse.data.user[0].fetch_flag != -1) {
                toast.success('Register successfull.')
                loginUser({ email, password }).then((res: any) => {
                    if (res.data.user[0].token) {
                        trackFacebookEvent('CompleteRegistration');
                        setAccessToken(res.data.user[0].token);
                        setUserAndPasswordLocal(res.data.user[0]);
                        navigate('/starter-frequencies');
                    }
                });
            } else {
                toast.error(registerResponse?.data?.user[0]?.rsp_msg)
            }
        } catch (error) {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    };

    return (
        <>
            <Head title="Register" />
            <section className="bg-white min-h-screen pt-[120px] flex justify-center pb-[2rem]">
                <div className="space-y-[2.31rem] w-[90%] sm:w-[30.5rem]">
                    <div className='space-y-[0.688rem]'>
                        <h1 className="text-2xl font-bold leading-tight tracking-tight text-center md:text-2xl">
                            Sign Up For a Free Account
                        </h1>
                        <h2 className="text-base text-center">Get 8 Meditation Frequencies FREE ($197 Value)</h2>
                        <h2 className="text-base text-center">Search 10,000+ Rife Frequencies FREE</h2>
                    </div>
                    <img
                        src={freeFrequencyBundles}
                        alt="Logo"
                        className="items-center mx-auto  block"
                    />
                    <div>
                        {registrationSuccess ? (
                            <div className="text-green-600 text-base">Registration successful! </div>
                        ) : (
                            <form className="bg-[#C5E9ED] px-[0.625rem] pt-[0.625rem] pb-[1.25rem] rounded-[0.875rem] space-y-[0.938rem]" onSubmit={handleSubmit}>
                                <div className="p-[0.625rem]">
                                    <label className='text-base block mb-[0.625rem]'>Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="block w-full h-[3rem] rounded-[4px] outline-none p-2"
                                        placeholder="Name"
                                        value={inforRegister.name}
                                        onChange={(e) => handleChangeInput(e)}
                                    />
                                    {errs.name && (
                                        <p className="!mt-2 text-[#ED3E4E] text-xs absolute">{errs.name}</p>
                                    )}
                                </div>
                                <div className="p-[0.625rem]">
                                    <label className='text-base block mb-[0.625rem]'>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="block w-full h-[3rem] rounded-[4px] outline-none p-2"
                                        placeholder="Email"
                                        value={inforRegister.email}
                                        onChange={(e) => handleChangeInput(e)}
                                    />
                                    {errs.email && (
                                        <p className="!mt-2 text-[#ED3E4E] text-xs absolute">{errs.email}</p>
                                    )}
                                </div>
                                <div className="p-[0.625rem]">
                                    <label className='text-base block mb-[0.625rem]'>Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        className="block w-full h-[3rem] rounded-[4px] outline-none p-2"
                                        onChange={(e) => handleChangeInput(e)}
                                        value={inforRegister.password}
                                    />
                                    {errs.password && (
                                        <p className="!mt-2 text-[#ED3E4E] text-xs absolute">{errs.password}</p>
                                    )}
                                </div>
                                <div className='text-center'>

                                    <button
                                        disabled={
                                            errs.name !== '' || errs.email !== '' || errs.password !== ''
                                                ? true
                                                : false
                                        }
                                        type="submit"
                                        className="px-[1.56rem] py-[0.625rem] text-base text-white rounded-[0.625rem] bg-[#00565B]"
                                    >
                                        <LoadingButton loading={loading} />
                                        Sign Up
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                    <p className="text-base text-center">
                        Already have an account?{' '}
                        <a onClick={() => navigate('/login')} className="font-semibold text-[#6C5E0D] cursor-pointer">
                            Login
                        </a>
                        <br />
                    </p>
                </div>
            </section>
        </>
    );
}
