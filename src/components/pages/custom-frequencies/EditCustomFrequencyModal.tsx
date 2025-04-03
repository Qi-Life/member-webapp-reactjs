import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { updateInforCustomFrequencies } from '~/services/CustomFrequencyServices';

const EditCustomFrequencyModal = (props: any) => {
    const [frequencyDetail, setfrequencyDetail] = useState(Object);
    const [errors, setErrors] = useState(Object)

    const handleChange = (e: any) => {
        setfrequencyDetail({ ...frequencyDetail, [e.target.name]: e.target.value });
    };

    const updateFrequency = async () => {
        if (frequencyDetail.name == '') {
            return setErrors({
                name: 'Name is required'
            })
        }
        try {
            await updateInforCustomFrequencies(frequencyDetail);
            toast.success('Update success')
            props.handleClickClose()
            props.handleEditFrequencySuccess(frequencyDetail)
        } catch (error) {
            toast.error('Update error')
        }
    };

    useEffect(() => {
        if (props.isOpenEditFrequency) {
            setfrequencyDetail(props.frequencyDetail)
        }
    }, [props.isOpenEditFrequency])


    return (
        <div
            onClick={(e) => {
                props.handleOverlayClick(e);
            }}
            className={` ${props.isOpenEditFrequency ? 'w-screen min-h-screen h-full absolute top-0 bg-black bg-opacity-20 z-50' : 'hidden'
                }   `}
        >
            <div
                className={`max-w-[500px] w-full z-10  duration-200 ease-linear  ${props.isOpenEditFrequency ? 'translate-y-1/2 opacity-100 visible ' : 'top-0 opacity-0 invisible'
                    } bg-white shadow-lg border border-gray rounded-md absolute top-0 left-1/2 -translate-x-1/2`}
            >
                <h1 className="text-center font-medium pb-[15px] text-[#059f83] p-[15px]">Edit Custom Frequency</h1>
                <hr />
                <form action="" className="py-[15px] px-[30px]" encType="multipart/form-data">
                    <div className="flex flex-col mb-2">
                        <label className="mb-[5px] font-medium" htmlFor="title">
                            Name:
                        </label>
                        <input
                            className="border border-gray outline-none p-1 h-[34px] rounded-sm"
                            type="text"
                            value={frequencyDetail.name}
                            onChange={handleChange}
                            name="name"
                            id="name"
                        />
                        {errors['name'] && <span className='text-red-500'>{errors['name']}</span>}
                    </div>
                    <div className="flex flex-col mb-[5px]">
                        <label className="mb-2 font-medium" htmlFor="description">
                            Description:
                        </label>
                        <textarea
                            className="border border-gray rounded-sm p-2 outline-none"
                            name="description"
                            id="description"
                            value={frequencyDetail.description}
                            onChange={handleChange}
                            cols={30}
                            rows={5}
                        />
                    </div>
                </form>
                <hr />
                <div className="flex items-center justify-end p-[15px]">
                    <button
                        onClick={() => props.handleClickClose()}
                        className="mx-1 px-3 py-1  rounded-sm shadow-md h-[34px] font-medium text-white bg-[#6C757D]"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => updateFrequency()}
                        className="mx-1 px-3  py-1 rounded-sm shadow-md h-[34px] bg-[#059f83] font-medium text-white"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCustomFrequencyModal;
