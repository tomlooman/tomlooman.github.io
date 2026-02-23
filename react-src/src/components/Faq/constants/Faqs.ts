import { Faq } from "../models/Faq";

const commonFaq: Faq[] = [
    {
        question: "For how long will this course be updated and supported?",
        answer: "Q&A Support and lesson updates will continue for years. There is no scheduled end-of-life and as Unreal Engine changes, so will this course to ensure compatibility."
    },
    {
        question: "When does the course start and finish?",
        answer: "You can follow the entire course at your own pace."
    },
    {
        question: "How long do I have access to the course?",
        answer: "You have unlimited access to this course."
    },
    {
        question: "What if I am unhappy with the course?",
        answer: "If you are unsatisfied with your purchase, contact me within 30 days and I will give you a full refund."
    },
    {
        question: "Is there Q&A support?",
        answer: "Yes, I am available to help you throughout the course! You can ask questions with each lesson and find previously answered questions or helpful tips from fellow students."
    },
    {
        question: "Are Subtitles available?",
        answer: "Yes! All lessons include multi-language subtitles. Including English, Korean, and Simplified Chinese."
    }
];

export const FAQs: { [key: number]: Faq[] } = {
    // C++ Course
    1: [
        ...commonFaq,
        {
            question: "What level of programming know-how is expected before starting?",
            answer: "The course is challenging and assumes some basic programming or scripting experience. Knowing C++ is not a requirement, any programming languages such as C#, Python, Unreal's Blueprint, etc. is enough."
        },
        {
            question: "Is this an official Stanford University course?",
            answer: "No, while this course curriculum has been taught to Computer Science students at Stanford University it is not affiliated nor owned/managed by the university in any capacity. Therefore, enrolling in this course does not make you a Stanford student, but the quality of the course should speak for itself!"
        }
    ],
    // Optimization Course
    2: [
        ...commonFaq,
        {
            question: "Which version of Unreal Engine was this course created with?",
            answer: "At this time, most lessons are recorded with UE 5.4 and above. New content will always be recorded with the latest release. Information on older versions will remain available to maintain compatibility with projects that are running older versions of UE5."
        }
    ]
};