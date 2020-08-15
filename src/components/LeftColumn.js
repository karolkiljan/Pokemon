import React from "react";
import {createUseStyles} from 'react-jss'
import pokemons from "../pictures/pokemons.png";

const MainLeft = () => {
    const classes = useStyles()
    return (
        <div className={classes.MainLeft} />
    )
}

const useStyles = createUseStyles({
    MainLeft: {
        width: '50vw',
        backgroundImage: `url(${pokemons})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center right',
    }
})

export default MainLeft
