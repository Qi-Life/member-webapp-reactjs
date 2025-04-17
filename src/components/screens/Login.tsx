import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginUser } from '../../services/AuthServices';
import { setAccessToken, setUserAndPasswordLocal, isLogined } from '../../helpers/token';
import { AuthContext } from '../context/AppProvider';
import Head from '../shared/Head';
import LoadingButton from '../LoadingButton';
import { addDeviceTokenFCM } from '~/services/ProfileService';
import { toast } from 'react-toastify';
import { useAudio } from '../context/AudioProvider';
import { validateEmail } from '~/helpers/util';
import { AuthInterface } from '~/interface/auth.interface';

const loginData: AuthInterface = {
    email: '',
    password: '',
};

export default function Login() {
    const navigate = useNavigate();
    const { loading, setLoading } = useContext(AuthContext);
    const [inforUser, setInforUser] = useState<AuthInterface>(loginData);
    const [errs, setErrors] = useState<AuthInterface>(loginData);
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        clearAll,
        trackListRef
    } = useAudio();


    const validateForm = (values: Partial<AuthInterface>) => {
        const newErrors = { ...errs };
        if ('email' in values) {
            newErrors.email = validateEmail(values.email || '') ? '' : 'Email invalid';
        }
        if ('password' in values) {
            newErrors.password = values.password?.length ? '' : 'Password is required';
        }
        setErrors(newErrors);
    };

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        const inputValue = type === 'checkbox' ? checked : value.trim();
        const newLoginData = { ...inforUser, [name]: inputValue }
        setInforUser(newLoginData);
        validateForm({ [name]: inputValue })
    };

    console.log(errs)

    const handleSubmit = async () => {
        setLoading(true);
        loginUser(inforUser)
            .then(async (res: any) => {
                setLoading(false);
                if (res.data.user[0].token) {
                    toast.success('Login successfully')
                    setAccessToken(res.data.user[0].token);
                    setUserAndPasswordLocal(res.data.user[0]);
                    await addDeviceTokenFCM({
                        os: 'web', token: localStorage.getItem('device_token')
                    })
                    if (searchParams.get('redirect') == 'new-password') {
                        setTimeout(() => navigate(`/new-password?code=${searchParams.get('code')}`), 1000)
                    } else {
                        navigate('/starter-frequencies');
                    }
                } else {
                    toast.error('Login failed. Please check your email and password.');
                }
            })
            .catch((err: any) => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (isLogined()) {
            navigate('/starter-frequencies');
        }
        clearAll()
        if (trackListRef) {
            trackListRef.current = [];
        }
    }, []);

    useEffect(() => {
        if (searchParams.get('redirect') == 'new-password') {
            setTimeout(() => navigate(`/new-password?code=${searchParams.get('code')}`), 1000)
        }
    }, [searchParams.get('redirect')])


    return (
        <>
            <Head title="Login" />
            <section className="bg-white mt-[100px] dark:bg-white pt-[4rem] pb-[2rem] sm:pt-[7.75rem] flex justify-center">
                <div className="w-[90%] lg:w-[31rem] space-y-[1.875rem]">
                    <h1 className="relative px-[1rem] text-2xl text-center font-bold leading-tight tracking-tight text-[#333333] md:text-2xl">
                        QUANTUM & RIFE <br />FREQUENCY WEBAPP
                        <span className='py-[0.31rem] text-sm px-[0.5rem] absolute bottom-[2.5rem] sm:bottom-0 right-0 sm:right-[1.5rem] bg-[#C3E7EB] font-medium flex items-center rounded-[1.12rem] text-base tracking-[0.1px]'>(BETA)</span>
                    </h1>
                    <form className="bg-[#C5E9ED] px-[0.625rem] pt-[0.625rem] pb-[1.25rem] rounded-[0.875rem] space-y-[0.938rem]"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}>

                        <div className="p-[0.625rem]">
                            <label className='text-base block mb-[0.625rem]'>Email</label>
                            <input
                                onChange={(e) => handleChange(e)}
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="block w-full h-[3rem] rounded-[4px] outline-none p-2"
                            />
                            {errs.email && (
                                <p className=" !mt-2 text-[#ED3E4E] text-xs absolute">{errs.email}</p>
                            )}
                        </div>
                        <div className="p-[0.625rem]">
                            <label className='text-base block mb-[0.625rem]'>Password</label>
                            <input
                                onChange={(e) => handleChange(e)}
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="block w-full h-[3rem] rounded-[4px] outline-none p-2"
                                value={inforUser.password}
                            />
                            {errs.password && (
                                <p className="!mt-2 text-[#ED3E4E] text-xs absolute break-all">{errs.password}</p>
                            )}
                        </div>
                        <div className="p-[0.625rem] flex flex-wrap justify-between">
                            <label htmlFor="rememberMe" className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    name="rememberMe"
                                    onChange={(e) => handleChange(e)}
                                    className="mr-2 leading-tight dark:bg-inherit w-[1.1rem] h-[1.1rem]"
                                />
                                <span className="text-sm">Remember Me</span>
                            </label>
                            <a href="forgot" className="font-semibold text-base text-[#00565B]">
                                Forgotten Password?
                            </a>
                        </div>
                        <div className='text-center'>
                            <button
                                disabled={errs.email !== '' || errs.password !== '' ? true : false}
                                type="submit"
                                className="px-[1.56rem] py-[0.625rem] text-base text-white rounded-[0.625rem] bg-[#00565B]"
                            >
                                <LoadingButton loading={loading} />
                                Sign in
                            </button>
                        </div>
                    </form>
                    <p className="text-base text-center">
                        Don&apos;t have an account? {' '}
                        <a className="font-semibold text-[#6C5E0D] cursor-pointer" onClick={() => navigate('/register')}>
                            Sign Up
                        </a>
                        <br />
                    </p>
                </div>
            </section>
        </>
    );
}
