import React from 'react'
import Image from '../assets/Logo/Logo-Full-Light.png'

import { FaLongArrowAltDown,FaShoppingCart  } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { NavLink,Link } from 'react-router-dom';
import { GrLinkNext } from "react-icons/gr";

import TextDesign from '../components/core/HomePage/Text'
import ButtonText from '../components/core/HomePage/Button'
import Video from '../assets/Images/banner.mp4'
import CodeBlocks from '../components/core/HomePage/Codeblock'
const Home = () => {
    return (
        <div>
            {/* FIrst we will write the code for the navbar */}
            <div className='flex text-white w-full h-fit justify-evenly border-b-2 items-center py-2'>
                <div className=''>
                    <img src={Image} alt="" className='h-10'/>
                </div>
                <div className='flex gap-5 px-12 pt-2'>
                    <div>
                        <NavLink to="/Home" className="hover:text-yellow-400"><p>Home</p></NavLink>
                    </div>
                    <div>
                        <NavLink to="/Catelog" className="hover:text-yellow-400"><p className='flex'>Catelog<FaLongArrowAltDown className="mt-1"/></p></NavLink>    
                    </div>
                    <div>
                        <NavLink to="/AboutUs" className="hover:text-yellow-400"><p>About us</p></NavLink>    
                    </div>
                    <div>
                        <NavLink to="/ContactUs" className="hover:text-yellow-400"><p>Contact us</p></NavLink>    
                    </div>
                </div>
                <div className='flex ml-4 gap-6'>
                    <IoSearch className='text-2xl'/>
                    <FaShoppingCart className='text-2xl '/>
                    <CgProfile className='text-2xl'/>
                </div>
            </div>

            {/* This is the Second section for*/}

            <div className='relative mx-auto flex flex-col  text-white max-w-maxContent w-11/12 items-center justify-between'>
                <Link to="/Signup">
                    <div className='group mt-10 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 group-hover:scale-2 w-fit'>
                        <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
                            <p>Become An instructor</p>
                            <GrLinkNext/>
                        </div>
                    </div>
                </Link>
                {/* This is the Text Section  */}
                <div className='text-center text-4xl font-semibold mt-7'>
                    <p className='text-white'>Empower Your Future With<TextDesign text="Coding Skills"/></p>
                </div>
                <div className='mt-4 w-[80%] text-center text-lg font-bold text-richblack-300'>
                    <p>With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. </p>
                </div>
                <div className='flex flex-row gap-7 mt-8'>
                    <ButtonText active={true} linkTo={'/Login'} >
                        Learn More
                    </ButtonText>
                    <ButtonText active={false} linkTo={'/Login'} >
                        Book a Demo
                    </ButtonText>
                </div>
            </div>

            {/*This is the Video section  */}
            <div className='mx-3 my-12 shadow-blue-200 w-11/12'>
                <video muted loop autoPlay >
                <source src={Video} type='video/mp4'/>
                </video>
            </div>

            <div>
                <CodeBlocks  
                position={"lg:flex-row"}
                heading={
                    <div className='text-4xl font-semibold'>
                        Unlock You 
                        <TextDesign text="coding Potential" />
                        With our Online Cources
                    </div>
                }
                subHeading={
                    "With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors."
                }
                catbtn1={
                    {
                        btnText:"Try it Yourself",
                        active:true,
                        linkTo:"/Signup"
                    }
                }
                catbtn2={
                    {
                        btnText:"Learn More",
                        active:true,
                        linkTo:"/LOgin"
                    }
                }
                codeBlock={`<<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet"href="styles.css">\n/head>\n<body>\n<h1><a href="/">Header</a>\n</h1>\n<nav><a href="one/">One</a><a href="two'>Two</\na><a href="THree/'>THree</a>\n</nav>\n</body>\n</html>`}
                codeColor={"text-yellow-25"}></CodeBlocks>
            </div>



            <div>
                <CodeBlocks  
                position={"lg:flex-row-reverse"}
                heading={
                    <div className='text-4xl font-semibold'>
                        Unlock You 
                        <TextDesign text="coding Potential" />
                        With our Online Cources
                    </div>
                }
                subHeading={
                    "With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors."
                }
                catbtn1={
                    {
                        btnText:"Continue Lesson",
                        active:true,
                        linkTo:"/Signup"
                    }
                }
                catbtn2={
                    {
                        btnText:"Learn More",
                        active:true,
                        linkTo:"/LOgin"
                    }
                }
                codeBlock={`<<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet"href="styles.css">\n/head>\n<body>\n<h1><a href="/">Header</a>\n</h1>\n<nav><a href="one/">One</a><a href="two'>Two</\na><a href="THree/'>THree</a>\n</nav>\n</body>\n</html>`}
                codeColor={"text-yellow-25"}></CodeBlocks>
            </div>

        </div>
    )
}

export default Home
