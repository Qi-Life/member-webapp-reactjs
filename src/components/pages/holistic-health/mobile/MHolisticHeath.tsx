import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import MBg1 from '~/assets/img/holistic/m-bg1.png';
import MBg2 from '~/assets/img/holistic/m-bg2.png';
import MBg3 from '~/assets/img/holistic/m-bg3.png';
import MBg4 from '~/assets/img/holistic/m-bg4.png';
import MBg5 from '~/assets/img/holistic/m-bg5.png';
import MProgressBar from './MProgressbar';
import { getQuestions, saveAnswer } from '~/services/HolisticHealth';
import { useNavigate } from 'react-router-dom';

const styles = [
    { url: MBg1, color: '#EBC776', barColor: '#EBC77633', activeAnswerColor: '#FBEAAE' },
    { url: MBg2, color: '#AFD790', barColor: '#AFD79033', activeAnswerColor: '#DAEDD8' },
    { url: MBg3, color: '#95AED6', barColor: '#95AED633', activeAnswerColor: '#CBDAEF' },
    { url: MBg4, color: '#FDC6BE', barColor: '#FDC6BE33', activeAnswerColor: '#FEC2B8' },
    { url: MBg5, color: '#D6C6E4', barColor: '#D6C6E433', activeAnswerColor: '#DCCBE7' },
];

const MHolisticHeath = () => {
    const [questionData, setQuestionData] = useState([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentTypeIndex, setCurrentTypeIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isLetsGo, setIsLetGo] = useState(true);
    const [activeId, setActiveId] = useState(null);

    const navigate = useNavigate()

    const userId = localStorage.getItem('id_user');


    const handleAnswerClick = (answerId: number) => {
        localStorage.setItem('isStartholistic', "1");
        const questionDataUpdated = questionData.map((qItem: any, QItemIndex) => {
            if (QItemIndex == currentTypeIndex) {
                qItem.questions = qItem.questions.map((q: any, qIndex: number) => {
                    if (qIndex == currentQuestionIndex) {
                        return { ...q, isAnswer: answerId }
                    } else {
                        return q
                    }
                })
                return qItem
            } else {
                return qItem
            }
        })
        setQuestionData(questionDataUpdated)
        if (currentQuestionIndex < questionData[currentTypeIndex]?.questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else if (currentTypeIndex < questionData.length - 1) {
            setCurrentTypeIndex((prev) => prev + 1);
            setCurrentQuestionIndex(0);
        }

        if (currentTypeIndex == questionData.length - 1 && currentQuestionIndex == questionData[currentTypeIndex]?.questions.length - 1) {
            const answerData: any = []
            questionData.map((item: any) => {
                item.questions.map((q: any) => {
                    answerData.push(
                        q.isAnswer
                    )
                })
            })
            saveUserAnswer(answerData)
        }
    };

    const saveUserAnswer = async (userAnswerData: any) => {
        try {
            setIsLoading(true);
            await saveAnswer({
                userId,
                answerData: userAnswerData,
            });
            setIsLoading(false);
            navigate('/holistic-health/m-result', {
                state: {
                    caculateLoading: true
                }
            })
        } catch (error) {
            setIsLoading(false);
        }
    };

    const fetchQuestions = async () => {
        let questionsRes = await getQuestions();
        if (questionsRes?.data) {
            const questionData = questionsRes?.data.map((item: any, index: number) => {
                return {
                    ...item,
                    style: styles[index]
                }
            })
            setQuestionData(questionData)
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        if (localStorage.getItem('isStartholistic') && localStorage.getItem('isStartholistic') == "1") {
            return navigate('/holistic-health/m-landing')
        }
        setTimeout(() => {
            setIsLetGo(false)
        }, 2000)
    }, [])

    const handleMouseDown = (id:any) => setActiveId(id);
    const handleMouseUp = () => setActiveId(null);
    const handleTouchStart = (id:any) => setActiveId(id);
    const handleTouchEnd = () => setActiveId(null);

    const activeAnswerColor = questionData[currentTypeIndex]?.style.activeAnswerColor;

    return (
        <AnimatePresence>
            {isLetsGo ? (
                <motion.div
                    className="h-screen flex justify-center items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    key="letsGetStarted" // Unique key for animation
                >
                    <h2 className="text-[40px] leading-[55px] flex flex-col items-center">
                        <span>LET’S</span>
                        <span>GET</span>
                        <span>STARTED</span>
                    </h2>
                </motion.div>
            ) : (
                <motion.div
                    className="text-center px-5 pt-10 min-h-screen"
                    style={{
                        backgroundImage: `url(${questionData[currentTypeIndex]?.style.url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    key="mainScreen" // Unique key for animation
                >
                    <h2 className="text-md mb-5 text-[20px] uppercase">{questionData[currentTypeIndex]?.questionType}</h2>
                    <div className="mx-auto flex flex-col h-full">
                        <h2 className="text-xl text-center text-[#39353D] font-medium mb-5">
                            {questionData[currentTypeIndex]?.questions[currentQuestionIndex]?.title}
                        </h2>
                        <ul className="space-y-3 mx-auto flex-1">
                            {questionData[currentTypeIndex]?.questions[currentQuestionIndex]?.answers.map((answer:any) => (
                                <li
                                    key={answer.id}
                                    tabIndex={0}
                                    onClick={() => handleAnswerClick(answer.id)}
                                    onMouseDown={() => handleMouseDown(answer.id)}
                                    onMouseUp={handleMouseUp}
                                    onTouchStart={() => handleTouchStart(answer.id)}
                                    onTouchEnd={handleTouchEnd}
                                    className="p-2.5 border border-solid text-base
                                        border-[#39353D80] rounded-[15px] text-center cursor-pointer transition"
                                    style={{
                                        backgroundColor: activeId === answer.id ? activeAnswerColor : '', // Inline dynamic style
                                    }}
                                >
                                    {answer.answer_text}
                                </li>
                            ))}
                        </ul>
                        <div className="my-auto py-10">
                            <MProgressBar questionData={questionData} />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MHolisticHeath;
