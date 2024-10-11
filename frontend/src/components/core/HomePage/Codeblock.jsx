import React from 'react'
import BUtton from './Button'
import { TypeAnimation } from 'react-type-animation'
import {FaArrowRight} from "react-icons/fa"

const Codeblock = ({position,heading,subHeading,catbtn1,catbtn2,codeBlock,codeColor}) => {
    return (
        <div className={`flex ${position} my-20 justify-between gap-10`}>
            <div className='w-[50%] flex flex-col gap-8'>
                {heading}
                <div className='text-richblack-300 font-bold'>
                    {subHeading}
                </div>

                <div className='flex gap-7 mt-7'>
                    <BUtton active={catbtn1.active} linkto={catbtn1.linkTo}>
                        <div className='flex gap-2 items-center'>
                            {catbtn1.btnText}
                            <FaArrowRight/>
                        </div>
                    </BUtton>

                    <BUtton active={catbtn2.active} linkto={catbtn2.linkTo}>
                        {catbtn2.btnText}
                    </BUtton>
                </div>
            </div>


            {/* section second for the numbers */}
            <div className='h-fit flex flex-row text-10[px] w-[100%] py-4 lg:w-[500px]'>
                <div  className='text-center flex flex-col w-[10%] text-richblack-900 font-inter font-bold' >
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                    <p>9</p>
                    <p>10</p>
                    <p>11</p>
                    <p>12</p>
                    <p>13</p>
                </div>

                <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono pr-2 ${codeColor}`}>
                    <TypeAnimation
                    sequence={[codeBlock,2000,""]}
                    repeat={Infinity}
                    cursor={true}
                    
                    style={
                        {
                            whiteSpace:"pre-line",
                            display:"block"
                        }
                    }

                    omitDeletionAnimation={true}
                    ></TypeAnimation>
                </div>
            </div>
        </div>
    )
}

export default Codeblock
