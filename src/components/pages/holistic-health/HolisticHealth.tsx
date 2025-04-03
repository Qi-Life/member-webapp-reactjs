import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from './ProgressBar';
import { getQuestions, saveAnswer } from '~/services/HolisticHealth';
import { useNavigate } from 'react-router-dom';
import { RiCheckboxCircleFill } from 'react-icons/ri';
import ProgressBarSegMent from './ProgressBarSegMent';
import './Holistic.css'
import HolisticHealthResult from './HolisticHealthResult';

const HolisticHealth = () => {
    const [questionTypeSelectedIndex, setQuestionTypeSelectedIndex] = useState(0);
    const [questionSelectedIndex, setQuestionSelectedIndex] = useState(0);
    const [questionTypess, setQuestionTypes] = useState([]);
    const [isFinishedAnswer, setIsFinishedAnswer] = useState(false);
    const [isLetsGo, setIsLetGo] = useState(true);
    const [isCaculating, setIscaculting] = useState(false);

    const navigate = useNavigate();

    const userId = localStorage.getItem('id_user');

    const fetchQuestions = async () => {
        let questionsRes = await getQuestions();
        if (questionsRes?.data) {
            setQuestionTypes(questionsRes.data);
            setQuestionSelectedIndex(0);
            setQuestionTypeSelectedIndex(0);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const saveUserAnswer = async (userAnswerData: any) => {
        try {
            await saveAnswer({
                userId,
                answerData: userAnswerData,
            });
            setIsFinishedAnswer(true);
        } catch (error) {
            console.error('Error saving user answer:', error);
            setIsFinishedAnswer(false);
        }
    };

    const handleCaculate = (status: boolean) => {
        setIscaculting(status)
    }

    const handleNextQuestion = () => {
        localStorage.setItem('isStartholistic', "1");
        const currentType = questionTypess[questionTypeSelectedIndex];
        let nextQuestion = questionSelectedIndex + 1
        // Move to the next question
        if (questionSelectedIndex < currentType.questions.length - 1) {
            setQuestionSelectedIndex(nextQuestion);
        }
        // Move to the next question type
        else if (questionTypeSelectedIndex < questionTypess.length - 1) {
            setQuestionTypeSelectedIndex(questionTypeSelectedIndex + 1);
            setQuestionSelectedIndex(0);
        }
    };

    const handleAnswer = (answer: any) => {
        const currentType = questionTypess[questionTypeSelectedIndex];
        const newQuestionTypes = questionTypess.map((type, typeIndex) =>
            typeIndex === questionTypeSelectedIndex
                ? {
                    ...type,
                    questions: type.questions.map((question: any, questionIndex: number) =>
                        questionIndex === questionSelectedIndex
                            ? {
                                ...question,
                                isAnswer: answer.id, // Update the isAnswer property
                            }
                            : question
                    ),
                }
                : type
        )
        if (
            currentType && questionSelectedIndex == currentType.questions.length - 1 &&
            questionTypeSelectedIndex == questionTypess.length - 1 && currentType.questions
        ) {
            const answerData: any = [];
            newQuestionTypes.map((item) => {
                item.questions.map((q: any) => {
                    answerData.push(q.isAnswer);
                });
            });
            saveUserAnswer(answerData)
        } else {
            setQuestionTypes(newQuestionTypes);
            handleNextQuestion()
        }
    };

    useEffect(() => {
        if (localStorage.getItem('isStartholistic') && localStorage.getItem('isStartholistic') == "1") {
            return navigate('/holistic-health/landing')
        }
        setTimeout(() => {
            setIsLetGo(false)
        }, 2000)
    }, [])

    const currentType = questionTypess[questionTypeSelectedIndex];
    const currentQuestion = currentType?.questions[questionSelectedIndex];

    const totalQuestions = questionTypess.reduce((acc, type) => acc + type.questions.length, 0);
    const totalQuestionsAnswer = questionTypess.reduce(
        (acc, type) => acc + type.questions.filter((q: any) => q.isAnswer > 0).length,
        0
    );

    const progess = totalQuestionsAnswer == totalQuestions - 1 ? 100 : Math.round((totalQuestionsAnswer / totalQuestions) * 100);

    return (
        <AnimatePresence>
            {isLetsGo ? (
                <motion.div
                    className="min-h-screen flex justify-center items-center"
                >
                    <h2 className="text-[40px] leading-[55px] ">LET'S GO</h2>
                </motion.div>
            ) : (
                <motion.div
                    className="flex flex-wrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    key="mainScreen" // Ensure unique key for AnimatePresence
                >
                    {!isCaculating && <div className="w-full sm:w-1/4 min-h-[100vh] bg-[#297D8226] flex flex-col px-[24px] justify-center border-r relative">
                        <h2 className='text-2xl 2xl:text-[28px] 2xl:leading-[32px] text-[#1A1A1A] font-normal mb-[16px]'>Holistic Wellness Assessment</h2>
                        <div className='mb-[24px] px-[5px]'>
                            <ProgressBar progress={progess} />
                        </div>
                        <ul className="space-y-[10px]">
                            {questionTypess.map((q, index) => (
                                <li
                                    key={q.id}
                                    className={`flex items-center gap-[13px] bg-[#297D821A] rounded-[8px] px-[16px] py-[8px] min-h-[80px] 2xl:min-h-[100px] font-normal text-xl 2xl:text-2xl
                                            ${questionTypeSelectedIndex === index && !isFinishedAnswer ? 'text-black bg-[#297D8233] ' : 'text-[#00000099]'
                                        }`}
                                >
                                    {(index < questionTypeSelectedIndex || isFinishedAnswer)
                                        && <span className='w-[24px]'><RiCheckboxCircleFill color='#297D82' /></span>} {q.questionType}
                                </li>
                            ))}
                        </ul>
                    </div>
                    }
                    <div className={`${isCaculating ? 'w-full' : 'w-3/4 relative flex justify-center'}`}>
                        {
                            (isFinishedAnswer) ?
                                <>
                                    <HolisticHealthResult isFinishedAnswer={isFinishedAnswer} handleCaculate={handleCaculate} />
                                </> :
                                <div className='flex flex-col items-center w-full h-full pt-[60px] xl:pt-[80px] 2xl:pt-[100px] 2xl:pt-[131px]'>
                                    <div className="justify-center items-center w-full">
                                        <h2
                                            className="min-h-[80px] xl:min-h-[96px] 2xl:min-h-[116px] text-xl 2xl:text-2xl text-center font-normal  mb-[16px] 2xl:mb-[24px]"
                                        >
                                            {currentQuestion?.title}
                                        </h2>
                                        <ul className="space-y-[24px] xl:space-y-[40px]  2xl:space-y-[64px] w-[70%] mx-auto">
                                            {currentQuestion?.answers.map((item: any) => (
                                                <li
                                                    key={item.id}
                                                    className="min-h-[80px] xl:min-h-[96px] 2xl:min-h-[116px] p-[16px] flex items-center justify-center border border-solid 
                                                    border-black rounded-[10px] bg-white text-xl 2xl:text-2xl text-center font-normal hover:bg-[#d7d7d7] active:bg-[#297D824D] hover:cursor-pointer"
                                                    onClick={() => handleAnswer(item)}
                                                >
                                                    {item.answer_text}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className='w-[90%] my-auto py-10'>
                                        <ProgressBarSegMent
                                            questionData={questionTypess}
                                            questionTypeSelectedIndex={questionTypeSelectedIndex}
                                            questionSelectedIndex={questionSelectedIndex}
                                        />
                                    </div>
                                </div>
                        }

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default HolisticHealth;
