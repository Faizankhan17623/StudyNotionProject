import React from 'react'
import Image from '../assets/Logo/Logo-Full-Light.png'
import Images from '../assets/Images/TimelineImage.png'
import { FaLongArrowAltDown,FaShoppingCart  } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { NavLink,Link } from 'react-router-dom';
import { GrLinkNext } from "react-icons/gr";

import TextDesign from '../components/core/HomePage/Text'
import ButtonText from '../components/core/HomePage/Button'
import Video from '../assets/Images/banner.mp4'
import CodeBlocks from '../components/core/HomePage/Codeblock'
// Logo 
import Logo1 from '../assets/TimeLineLogo/Logo1.svg'
import Logo2 from '../assets/TimeLineLogo/Logo2.svg'
import Logo3 from '../assets/TimeLineLogo/Logo3.svg'
import Logo4 from '../assets/TimeLineLogo/Logo4.svg'

const Home = () => {
    // const color = ['text-pink-700','text-richblack-800'];
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
                    <ButtonText active={true} link={'/Login'} >
                        Learn More
                    </ButtonText>
                    <ButtonText active={false} link={'/Login'} >
                        Book a Demo
                    </ButtonText>
                </div>
            </div>

            {/*This is the Video section  */}
                <div className='mx-[250px] mt-8 left-2 w-8/12 border-2 shadow-blue-200 shadow-2xl relative'>
                <span className='w-8/12 shadow-lg bg-white absolute bottom-8 left-4 z-4'></span>
                    <video muted loop autoPlay className='w-full h-auto'> 
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
                        link:'/Signup'
                    }
                }
                catbtn2={
                    {
                        btnText:"Learn More",
                        active:false,
                        link:'/LOgin'
                    }
                }
                codeBlock={`<<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet"href="styles.css">\n/head>\n<body>\n<h1><a href="/">Header</a>\n</h1>\n<nav><a href="one/">One</a><a href="two'>Two</\na><a href="THree/'>THree</a>\n</nav>\n</body>\n</html>`}
                codeColor={'text-pink-700'}></CodeBlocks>
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
                        link:'/Signup'
                    }
                }
                catbtn2={
                    {
                        btnText:"Learn More",
                        active:false,
                        link:'/Login'
                    }
                }
                codeBlock={`<<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet"href="styles.css">\n/head>\n<body>\n<h1><a href="/">Header</a>\n</h1>\n<nav><a href="one/">One</a><a href="two'>Two</\na><a href="THree/'>THree</a>\n</nav>\n</body>\n</html>`}
                codeColor={"text-yellow-25"}></CodeBlocks>
            </div>


            {/* This is the cards section that we are Going to skip */}
            
            <div className=' bg-white flex flex-row w-ful h-fit'>
                <div className='flex w-[80%]'>
                    <div className='w-[50]'>
                        <p>Get the Skills need for a <TextDesign text="Job That is in Demand" /></p>
                    </div>
                    <div>
                        <p>The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional  skills.</p>
                        <ButtonText active={true} link={'/login'}>
                        Learn More
                        </ButtonText>
                    </div>
                </div>
            </div>

            {/* THis is the second section */}
            
            <div className='bg-white'>
                <div className=''>
                    <div>
                        <img src={Logo1} alt="This is the First icon" />
                        <div>
                            <p>LeaderShip</p>
                            <p>Fully committed to the success company</p>
                        </div>
                    </div>
                    <div>
                        <img src={Logo2} alt="This is the Second icon" />
                        <div>
                            <p>Responsibility</p>
                            <p>Students will always be our top priority</p>
                        </div>
                    </div>
                    <div>
                        <img src={Logo3} alt="This is the Third icon" />
                        <div>
                            <p>Flexbility</p>
                            <p>The ability to switch is an important skills</p>
                        </div>
                    </div>
                    <div>
                        <img src={Logo4} alt="This is the Fourth icon" />
                        <div>
                            <p>Solve the problem</p>
                            <p>Code your way to a solution</p>
                        </div>
                    </div>
                </div>
                <div>
                    <img src={Images} alt="This is the Student Learning in the Sunshine " />
                    <div></div>
                </div>
            </div>
        </div>
    )
}

export default Home;