import React, { useState } from 'react';
import accordionStyle from "./styles/styles.module.css"

const Accordion = ({title, children}) => {
    const [accordionOpen, setAccordionOpen] = useState(false);

    const toggleAccordion = () => {
        if (accordionOpen) {
            setAccordionOpen(false);
        } else {
            setAccordionOpen(true);
        }
    }

    return (
        <div className={accordionStyle.accordion} onClick={() => toggleAccordion()}> 
            <header>
                <h3>{title}</h3>
                <p>{accordionOpen ? "-" : "+"}</p>
            </header>

            {
                accordionOpen && <>
                {children}
                </>
            }
        </div>
    )
}

export default Accordion;