import React, {useEffect, useState} from 'react'
import {BrowserRouter as Router, Route, Switch, Link} from "react-router-dom"
import {createUseStyles} from 'react-jss'
import pokemons from './pictures/pokemons.png'
import logo from './pictures/pokemonLogo.png'
import axios from 'axios';

import ReactPaginate from 'react-paginate';

const DetailsSite = (props) => {
    return (
        <div>
        </div>
    )

}

const PaginationButton = (props) => {
    const classes = useStyles()
    return (
        <div className={classes.PaginationButton} onClick={() => props.onClick(props.number)}>
            <div className={classes.TextInList}>{props.number}</div>
        </div>
    )
}
const HeaderOfList = () => {
    const classes = useStyles()
    return (
        <div className={classes.HeaderOfList}>
            <RowTextElement style={classes.IdInList} content={'Id'}/>
            <RowTextElement style={classes.PokemonInList} content={'Pokemon'}/>
            <RowTextElement style={classes.NameInList} content={'Name'}/>
            <RowTextElement style={classes.LvlInList} content={'Min lvl'}/>
            <RowTextElement style={classes.TypeInList} content={'Type'}/>
            <RowTextElement style={classes.EvolutionInList} content={'Evolution'}/>
        </div>
    )
}

const RowTextElement = (props) => {
    const classes = useStyles()
    return (
        <div className={props.style}>
            <p className={classes.TextInList}>{props.content}</p>
        </div>
    )
}
const RowImageElement = (props) => {
    return (
        <img src={props.content} className={props.style}/>
    )
}


const ElementOfList = (props) => {
    const classes = useStyles()
    const [stats, setStats] = useState(
        {
            id:'',
            pokemon: '',
            name: '',
            minLvl: 1,
            type: '',
            evolution: '',
        })

    useEffect (()=> {
        console.log(stats)
        const firstFetch = async (secondFetch) => {
            const details = await fetch(props.elem.url)
            console.log(props.elem.url)
            const detailsJson = await details.json()
            return secondFetch(detailsJson)
        }

        const secondFetch = async (detailsJson) => {
            const pokemonSpecies = await fetch('https://pokeapi.co/api/v2/pokemon-species/' + detailsJson.id)
            const pokemonSpeciesJson = await pokemonSpecies.json()
            return thirdFetch(detailsJson, pokemonSpeciesJson.evolution_chain.url)
        }
        const thirdFetch = async (detailsJson, evolutionChainUrl) => {
            let picture = detailsJson.sprites.other
            picture = picture['official-artwork']

            picture = picture.front_default

            const evolutionChain = await fetch(evolutionChainUrl)
            console.log('kurwa ti ' + toString(evolutionChain))
            const evolutionChainJson = await evolutionChain.json()
            console.log(evolutionChainJson.chain.species.name + evolutionChainJson.chain.evolution_details)

            const findMinLvl = (pokeObject) => {
                if(pokeObject.species.name === detailsJson.name){
                    if(pokeObject.evolution_details.length === 0)
                        return 1
                    else
                        return pokeObject.evolution_details[0].min_level
                } else {
                    return pokeObject.evolves_to.forEach((elem) => findMinLvl(elem))
                }
            }

            const findEvolution = (pokeObject) => {
                if(pokeObject.species.name === detailsJson.name){
                    if(pokeObject.evolves_to.length === 0)
                        return 'None'
                    else
                        return pokeObject.evolves_to[0].species.name
                } else {
                    return pokeObject.evolves_to.forEach((element, index, array) => findEvolution(element))
                }
            }

            const min_level = await findMinLvl(evolutionChainJson.chain)
            const evolution = await findEvolution(evolutionChainJson.chain)
            let id = detailsJson.id

            if( parseInt(detailsJson.id) % 100 > 0){
                id = detailsJson.id
            } else {
                if(parseInt(detailsJson.id) % 10 > 0){
                    id = '0' + detailsJson.id
                } else {
                    id = '00' + detailsJson.id
                }
            }

            const result = {
                id: id,
                pokemon: picture,
                name: detailsJson.name,
                minLvl: min_level,
                type: detailsJson.types[0].type.name,
                evolution: evolution,
            }

            if(JSON.stringify(result) !== JSON.stringify(stats))
                setStats({
                             id: id,
                             pokemon: picture,
                             name: detailsJson.name,
                             minLvl: min_level,
                             type: detailsJson.types[0].type.name,
                             evolution: evolution,
                         })
        }

        firstFetch(secondFetch)

    },[stats])
    return (
        <div className={classes.ElementOfList}>
            <RowTextElement style={classes.IdInList} content={stats.id}/>
            <RowImageElement style={classes.PokemonInList} content={stats.pokemon}/>
            <RowTextElement style={classes.NameInList} content={stats.name}/>
            <RowTextElement style={classes.LvlInList} content={stats.minLvl}/>
            <RowTextElement style={classes.TypeInList} content={stats.type}/>
            <RowTextElement style={classes.EvolutionInList} content={stats.evolution}/>
        </div>

    )
}

const MainLeft = () => {
    const classes = useStyles()
    return (
        <div className={classes.MainLeft} />
    )
}
const MainRight = () => {
    const classes = useStyles()

    const [listOfPokemons, setListOfPokemons] = useState([])
    const [currentPagesList, setCurrentPagesList] = useState([1,2,3,4,5,6])
    const [currentPage, setCurrentPage] = useState(1)

    const [fetchLink, setFetchLink] = useState(`https://pokeapi.co/api/v2/pokemon/?limit=10&offset=0`)
    const fetchData = async () => {
        const response = await fetch(fetchLink)
        const result = await response.json()
        console.log(result.results)
        setListOfPokemons(result.results.sort((a,b) => (a.id < b.id)? -1: 1))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect( () => {
        console.log(currentPage)

        fetchData()
        if(currentPage > 3){
            const index = currentPagesList.indexOf(currentPage)
            setCurrentPagesList(currentPagesList.map(elem => elem + index - 3))
        } else {
            setCurrentPagesList([1,2,3,4,5,6])
        }
        setFetchLink(`https://pokeapi.co/api/v2/pokemon/?limit=10&offset=${(currentPage - 1) * 10}`)
    },[currentPage])

    return (
        <div className={classes.MainRight}>
            <div className={classes.ApiContainer}>
                <div className={classes.Logo}/>
                <div className={classes.ListComponent}>
                    <HeaderOfList/>
                    {listOfPokemons.map(elem => <ElementOfList elem={elem}/>)}
                </div>
                <div className={classes.ButtonsComponent}>
                    <div className={classes.ButtonsWrapper}>
                        {currentPagesList.map(elem => <PaginationButton number={elem} onClick={setCurrentPage}/>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

const Main = () => {
    const classes = useStyles()
    return (
        <div className={classes.App}>
            <MainLeft/>
            <MainRight />
        </div>
    )
}

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path='/' component={Main}/>
                <Route path='/details' component={DetailsSite}/>
            </Switch>
        </Router>

    );
}

const useStyles = createUseStyles({
    App : {
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        width: '100vw',
    },
    MainLeft: {
        width: '50vw',
        backgroundImage: `url(${pokemons})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center right',


    },
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

    Logo: {
        height: '15%',
        backgroundImage: `url(${logo})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    },
    ListComponent: {
        height: '75%',
        backgroundColor: 'yellow',
    },
    ButtonsWrapper: {
        width: '55%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },

    ButtonsComponent: {
        height: '10%',
        marginTop: '4%',
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'center',
    },

    HeaderOfList: {
        backgroundColor: '#f9e01d',
        height: '10%',
        flexDirection: 'row',
        display: 'flex',
        paddingTop: 1,
        paddingBottom: 1
    },

    ElementOfList: {
        backgroundColor: '#f4f4f4',
        width: '100%',
        height: '9.2%',
        flexDirection: 'row',
        display: 'flex',
        // paddingTop: 5,
        // paddingBottom: 5
    },
    IdInList: {
        width: '10%',
        height: '100%',
        textAlign: 'center',

    },
    PokemonInList: {
        width: '18%',
        height: '100%',
        justifyContent: 'center',
        objectFit: 'contain',
        textAlign: 'center',
    },
    NameInList: {
        width: '18%',
        height: '100%',
        textAlign: 'center',

    },
    LvlInList: {
        width: '18%',
        height: '100%',
        textAlign: 'center',
    },
    TypeInList: {
        width: '18%',
        height: '100%',
        textAlign: 'center',
    },
    EvolutionInList: {
        width: '18%',
        height: '100%',
        textAlign: 'center',
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

export default App
