import React from "react";
import {createUseStyles} from "react-jss";

const PaginationButton = (props) => {
    const classes = useStyles()
    return (
        <div className={classes.PaginationButton} onClick={() => props.onClick(props.number)}>
            <div className={classes.TextInList}>{props.number}</div>
        </div>
    )
}

const PaginationComponent = (props) => {
    const classes = useStyles()
    return (
        <div className={classes.ButtonsComponent}>
            <div className={classes.ButtonsWrapper}>
                {props.currentPagesList.map(elem => <PaginationButton number={elem} onClick={props.setCurrentPage}/>)}
            </div>
        </div>
    )
}


const useStyles = createUseStyles({
    ButtonsWrapper: {
        width: '55%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },

    ButtonsComponent: {
        height: '10%',
        marginTop: '10%',
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'center',
    },
    TextInList: {
        fontSize: 20,
        color: '#2966b4',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    PaginationButton: {
        width: '2.6vw',
        height: '4vh',
        backgroundColor: '#f9e01d',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default PaginationComponent
