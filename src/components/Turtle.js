import './css/Turtle.css';
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

function WhereLink(props) {
    return (
        <Link to={props.to}>
            <div className={props.className}>
                <img src={props.src} className='Where_Link' alt={props.alt} />
                <p className='Where_Link_Text'>{props.text}</p>
            </div>
        </Link>
    );
}

function Locked(props) {
    return (
        <div className={props.className}>
            <img src='/Locked.png' className='Where_Link' alt={props.alt} />
            <p className='Where_Link_Text'>?</p>
        </div>
    );
}

export default function Turtle() {
    const badge = 1;
    return (
        <div>
            <div className='menu'>
                <p className='pageName'>거북이 수족관</p>
                <div className='Turtle_Background'>
                    <img src='/Road.png' className='Road' alt='SeaRoad' />

                    {/* 바닷속 마을 */}
                    {badge >= 1 ? (
                        <WhereLink
                            className='UnderTheSea_LinkContainer'
                            to='/DeepSea'
                            src='/UnderTheSea_Link.png'
                            alt='DeepSea'
                            text='바닷속 마을'
                        />
                    ) : (
                        <Locked className='Locked1'/>
                    )}

                    {/* 숲속 마을 */}
                    {badge >= 2 ? (
                        <WhereLink
                            className='Forest_LinkContainer'
                            to='/Forest'
                            src='/Forest_Link.png'
                            alt='Forest'
                            text='숲속 마을'
                        />
                    ) : (
                        <Locked className='Locked2' />
                    )}

                    {/* 구름 마을 */}
                    {badge >= 3 ? (
                        <WhereLink
                            className='Sky_LinkContainer'
                            to='/Sky'
                            src='/Sky_Link.png'
                            alt='Cloud'
                            text='구름 마을'
                        />
                    ) : (
                        <Locked className='Locked3' />
                    )}

                    {/* 우주 마을 */}
                    {badge >= 4 ? (
                        <WhereLink
                            className='Space_LinkContainer'
                            to='/Space'
                            src='/Space_Link.png'
                            alt='Space'
                            text='우주 마을'
                        />
                    ) : (
                        <Locked className='Locked4' />
                    )}
                    <Locked className='Locked1' />
                </div>
            </div>
        </div>
    );
}
