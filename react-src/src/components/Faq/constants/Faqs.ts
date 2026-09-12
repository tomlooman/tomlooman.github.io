import { Faq } from "../models/Faq";

const commonFaq: Faq[] = [
    {
        question: "For how long will this course be updated and supported?",
        answer: "The course will be updated to maintain compatibility with the latest engine versions. In 2026 the entire course has been upgraded to Unreal Engine 5.6 and compatible with 5.8. Q&A support is an ongoing part of the course, and there are no plans to discontinue it."
    },
    {
        question: "When does the course start and finish?",
        answer: "You can follow the entire course at your own pace."
    },
    {
        question: "How long do I have access to the course?",
        answer: "You have lifetime access to this course."
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
        answer: "Yes! All lessons include multi-language subtitles, including English, Korean (한국어), Simplified Chinese (中文, 简体), Portuguese (Português - Brazil), Japanese (日本語), and Turkish (Türkçe)."
    }
];

export const FAQs: { [key: number]: Faq[] } = {
    // C++ Course
    1: [
        ...commonFaq,
        {
            question: "What level of programming know-how is expected before starting?",
            answer: "The course is challenging and assumes some basic programming or scripting experience. Knowing C++ is not a requirement, any programming languages such as C#, Python, Unreal's Blueprint, etc. is enough."
        }
    ],
    // Optimization Course
    2: [
        ...commonFaq,
        {
            question: "Which version of Unreal Engine was this course created with?",
            answer: "Lessons are recorded with a mix of engine versions. Starting at UE 5.4 up to UE 5.8. New content will always be recorded with the latest release. Information on older versions will remain available to maintain compatibility with projects that are running older versions."
        },
        {
            question: "What does 'Early Access' mean for this course?",
            answer: "The Early Access Program allows me to get you a large amount of completed content today while I continue to build towards a V1.0 release. You receive all updates at no additional cost."
        }
    ]
};