import React, { useContext, useState, useRef } from 'react';
import { AuthContext } from '~/components/context/AppProvider';
import { addCustomFrequencies, getCustomFrequencies } from '~/services/CustomFrequencyServices';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ModalAddNewCustomFrequencies = (props: any) => {
	const {
		isOpen,
		handleClickClose,
		setDataCustomFrequency,
		handleOverlayClick,
	} = useContext(AuthContext);

	const [frequencies, setFrequencies] = useState(['0']);

	const [inforCustomFrequency, setInforCustomFrequency] = useState({
		name: '',
		description: '',
		frequencies: frequencies,
	});
	const audioContext = new window.AudioContext();
	const oscillatorRef = useRef(null);

	const handleChange = (e: any) => {
		setInforCustomFrequency({ ...inforCustomFrequency, [e.target.name]: e.target.value });
	};

	const handleChangeFre = (index: number, e: any) => {
		const updatedFrequencies = [...frequencies];
		updatedFrequencies[index] = e.target.value;
		setFrequencies(updatedFrequencies);

		setInforCustomFrequency({
			...inforCustomFrequency,
			frequencies: updatedFrequencies,
		});
	};

	const handleAddCustomFrequency = async () => {
		try {
			if (
				inforCustomFrequency.name !== '' &&
				inforCustomFrequency.description !== '' &&
				inforCustomFrequency.frequencies.length > 0
			) {
				const frequenciesString = inforCustomFrequency.frequencies.join('/');

				// Create the new data object with the transformed frequencies
				const newInforCustomFrequency = {
					...inforCustomFrequency,
					frequencies: frequenciesString,
				};

				const added = await addCustomFrequencies(newInforCustomFrequency);
				if (added) {
					toast.success('Add custom frequency success')
					const resDataCustomFrequencies = await getCustomFrequencies();
					setDataCustomFrequency(resDataCustomFrequencies.data[0]);
					setDefaultValue();
				}
				handleClickClose();
			} else {
				toast.error('Can not add custom frequency')
			}
		} catch (error) {
			// alert("Can not add! Please try again!");
			toast.error('Can not add custom frequency')
		}
	};

	const playFrequency = (frequency: any) => {
		if (audioContext.state === 'suspended') {
			audioContext.resume();
		}

		const frequencyValue = parseFloat(frequency);

		if (!isNaN(frequencyValue)) {
			if (oscillatorRef.current) {
				oscillatorRef.current.stop();
			}

			const newOscillator = audioContext.createOscillator();
			newOscillator.type = 'sine';
			newOscillator.frequency.value = frequencyValue;
			newOscillator.connect(audioContext.destination);
			newOscillator.start();

			oscillatorRef.current = newOscillator;
		} else {
			alert('Please enter a valid frequency value.');
		}
	};

	const stopPlayFrequency = (item: any) => {
		if (oscillatorRef.current) {
			oscillatorRef.current.stop();
		}
	};

	const Add = () => {
		setFrequencies([...frequencies, '0']);
	};

	const Minus = (index: number) => {
		const updatedFrequencies = [...frequencies.slice(0, index), ...frequencies.slice(index + 1)];
		setFrequencies(updatedFrequencies);
	};

	const handleClickCloseAdd = () => {
		setDefaultValue();
		if (oscillatorRef.current) {
			oscillatorRef.current.stop();
		}
	};

	const setDefaultValue = () => {
		setFrequencies(['0']);
		setInforCustomFrequency({ name: '', description: '', frequencies: ['0'] });
	};

	return (
		<div
			onClick={(e) => handleOverlayClick(e)}
			className={` ${isOpen ? 'w-screen h-screen absolute top-0 bg-black bg-opacity-20  z-[9999]' : 'hidden'}   `}
		>
			<div
				className={`max-w-[500px] w-full z-10  duration-200 ease-linear p-4 ${isOpen ? 'translate-y-1/2 opacity-100 visible ' : 'top-0 opacity-0 invisible'
					} bg-white shadow-lg border border-gray rounded-md fixed top-0 left-1/2 -translate-x-1/2`}
			>
				<h1 className="text-center text-[#059f83]">Add New Custom Frequency</h1>
				<hr />
				<form action="" className="p-4" encType="multipart/form-data">
					<div className="flex flex-col">
						<label className="mb-2 mt-2 font-medium" htmlFor="name">
							Program Frequencies Name:
						</label>
						<input
							className="border border-gray outline-none p-1 h-[34px] rounded-sm"
							type="text"
							name="name"
							id="name"
							value={inforCustomFrequency.name}
							onChange={(e) => handleChange(e)}
						/>
					</div>
					<div className="flex flex-col">
						<label className="mb-2 mt-2 font-medium" htmlFor="description">
							Description:
						</label>
						<input
							className="border border-gray outline-none p-1 h-[34px] rounded-sm"
							type="text"
							name="description"
							id="description"
							value={inforCustomFrequency.description}
							onChange={(e) => handleChange(e)}
						/>
					</div>
					<div className="flex flex-col">
						<label className="mb-2 font-medium" htmlFor="frequencies">
							Frequencies(Hz):
						</label>
						{Array.from(frequencies).map((item: any, index: number, array: string[]) => {
							return (
								<div key={index}>
									<div className="h-[34px] flex items-center rounded-md border border-gray overflow-hidden mb-2">
										<input
											className="outline-none px-2 h-[34px] w-full rounded-sm"
											type="number"
											min={0}
											name="frequencies[]"
											id="frequencies"
											value={item}
											onChange={(e) => {
												handleChangeFre(index, e);
											}}
										/>
										<button
											type="button"
											onClick={() => playFrequency(item)}
											className="bg-[#059f83] h-full px-2 text-white"
										>
											Play
										</button>
										<button
											type="button"
											onClick={() => stopPlayFrequency(item)}
											className="bg-[#059d45] h-full px-2 text-white"
										>
											Stop
										</button>
										{index === array.length - 1 ? (
											<>
												<button type="button" onClick={() => Add()} className="h-full px-2">
													<FaPlus />
												</button>
											</>
										) : (
											<>
												<button type="button" onClick={() => Minus(index)} className="h-full px-2">
													<FaMinus />
												</button>
											</>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</form>
				<hr />
				<div className="flex items-center justify-end py-4">
					<button
						onClick={() => {
							handleClickClose();
							handleClickCloseAdd();
						}}
						className="mx-1 h-9 px-2 py-1 rounded-sm shadow-md text-[12px] font-medium text-white bg-[#6C757D]"
					>
						Close
					</button>
					<button
						onClick={() => handleAddCustomFrequency()}
						className="mx-1 h-9 px-2 py-1 rounded-sm shadow-md text-[12px] bg-[#059f83] font-medium text-white"
					>
						Add
					</button>
				</div>
			</div>
		</div>
	);
};

export default ModalAddNewCustomFrequencies;
