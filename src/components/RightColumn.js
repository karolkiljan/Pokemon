import React, {useEffect, useState} from "react";
import {createUseStyles} from "react-jss";
import logo from "../pictures/pokemonLogo.png";
import PaginationComponent from "./PaginationComponent";
import ListComponent from "./ListComponent";
import LogoComponent from "./LogoComponent";

const MainRight = () => {
    const classes = useStyles()

    const [listOfPokemons, setListOfPokemons] = useState([])
    const [currentPagesList, setCurrentPagesList] = useState([1,2,3,4,5,6])
    const [currentPage, setCurrentPage] = useState(1)
    const [prevPage, setPrevPage] = useState(0)
    const [fetchLink, setFetchLink] = useState(`https://pokeapi.co/api/v2/pokemon/?limit=10&offset=0`)

    const handleChange = (num) => {
        setPrevPage(currentPage)
        setCurrentPage(num)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect( () => {
        console.log(prevPage, currentPage)
        const fetchData = async () => {
            const response = await fetch(fetchLink)
            const result = await response.json()
            setListOfPokemons(result.results)
            console.log(listOfPokemons)
            setFetchLink(`https://pokeapi.co/api/v2/pokemon/?limit=10&offset=${(currentPage-1) * 10}`)

        }
        if(prevPage !== currentPage){
            fetchData()
            if(currentPage > 3){
                const index = currentPagesList.indexOf(currentPage)
                setCurrentPagesList(currentPagesList.map(elem => elem + index - 3))
            } else {
                setCurrentPagesList([1,2,3,4,5,6])
            }
        }
        return () => setListOfPokemons([])
    },[currentPage, fetchLink])

    return (
        <div className={classes.MainRight}>
            <div className={classes.ApiContainer}>
                <LogoComponent />
                <ListComponent listOfPokemons={listOfPokemons} />
                <PaginationComponent currentPagesList={currentPagesList} setCurrentPage={handleChange}/>
            </div>
        </div>
    )
}

const useStyles = createUseStyles({
    MainRight: {
        width: '50vw',
        paddingRight: '2.5%',
        paddingLeft: '2.5%',
        paddingTop: '0.5%',
        paddingBottom: '0.5%'

    },

    ApiContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        wight: '50%',

    },
})

export default MainRight
