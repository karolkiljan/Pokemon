import React, {useEffect, useState} from "react";
import {createUseStyles} from "react-jss";
import {NavLink} from "react-router-dom";

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

export const RowTextElementWithMouse = (props) => {
    const classes = useStyles()
    return (
        <div className={props.style}>
            <p className={classes.TextInListWithMouse}>{props.content}</p>
        </div>
    )
}

export const RowTextElement = (props) => {
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
    const [linkId, setLinkId] = useState('')
    const [isShown, setIsShown] = useState(false)

    useEffect (()=> {

        const firstFetch = async (secondFetch) => {
            const details = await fetch(props.elem.url)

            const detailsJson = await details.json()
            return secondFetch(detailsJson)
        }

        const secondFetch = async (detailsJson) => {
            const pokemonSpecies = await fetch('https://pokeapi.co/api/v2/pokemon-species/' + detailsJson.id)
            setLinkId(detailsJson.id)
            const pokemonSpeciesJson = await pokemonSpecies.json()
            return thirdFetch(detailsJson, pokemonSpeciesJson.evolution_chain.url)
        }
        const thirdFetch = async (detailsJson, evolutionChainUrl) => {
            let picture = detailsJson.sprites.other
            picture = picture['official-artwork']

            picture = picture.front_default

            const evolutionChain = await fetch(evolutionChainUrl)

            const evolutionChainJson = await evolutionChain.json()

            const findMinLvl = (pokeObject) => {
                if(pokeObject.species.name === detailsJson.name){
                    if(pokeObject.evolution_details.length === 0)
                        return 1
                    else
                        return pokeObject.evolution_details[0].min_level
                } else {
                    return findMinLvl(pokeObject.evolves_to[0])
                    // return pokeObject.evolves_to.forEach((elem) => findMinLvl(elem))
                }
            }

            const findEvolution = (pokeObject) => {
                if(pokeObject.species.name === detailsJson.name){
                    if(pokeObject.evolves_to.length === 0)
                        return 'None'
                    else
                        return pokeObject.evolves_to[0].species.name
                } else {
                    return findEvolution(pokeObject.evolves_to[0])
                    // return pokeObject.evolves_to.forEach((element, index, array) => findEvolution(element))
                }
            }

            const min_level = await findMinLvl(evolutionChainJson.chain)
            const evolution = await findEvolution(evolutionChainJson.chain)
            let id = detailsJson.id

            if( parseInt(detailsJson.id) > 99){
                id = detailsJson.id
            } else {
                if(parseInt(detailsJson.id) > 9){
                    id = '0' + detailsJson.id
                } else {
                    id = '00' + detailsJson.id
                }
            }

            const result = {
                id: id,
                pokemon: picture,
                name: detailsJson.name.toUpperCase(),
                minLvl: min_level,
                type: detailsJson.types[0].type.name.toUpperCase(),
                evolution: evolution.toUpperCase(),
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

    if(isShown)
        return (
            <NavLink onMouseLeave={() => setIsShown(false)} to={`/${linkId}`} className={classes.ElementOfListWithMouse}>
                <RowTextElement style={classes.IdInList} content={stats.id}/>
                <RowImageElement style={classes.PokemonInList} content={stats.pokemon}/>
                <RowTextElementWithMouse style={classes.NameInList} content={stats.name}/>
                <RowTextElement style={classes.LvlInList} content={stats.minLvl}/>
                <RowTextElement style={classes.TypeInList} content={stats.type}/>
                <RowTextElementWithMouse style={classes.EvolutionInList} content={'More'}/>
            </NavLink>
        )
    else
        return (
            <div onMouseEnter={() => setIsShown(true)} className={classes.ElementOfListWithoutMouse}>
                <RowTextElement style={classes.IdInList} content={stats.id}/>
                <RowImageElement style={classes.PokemonInList} content={stats.pokemon}/>
                <RowTextElement style={classes.NameInList} content={stats.name}/>
                <RowTextElement style={classes.LvlInList} content={stats.minLvl}/>
                <RowTextElement style={classes.TypeInList} content={stats.type}/>
                <RowTextElement style={classes.EvolutionInList} content={stats.evolution}/>
            </div>
        )
}

const ListComponent = (props) => {
    const classes = useStyles()
    return (
        <div className={classes.ListComponent}>
            <HeaderOfList/>
            {props.listOfPokemons.map(elem => <ElementOfList elem={elem}/>)}
        </div>
    )
}

const useStyles = createUseStyles({
    HeaderOfList: {
        backgroundColor: '#f9e01d',
        height: '10%',
        flexDirection: 'row',
        display: 'flex',
        paddingTop: 1,
        paddingBottom: 1
    },
    ListComponent: {
        height: '75%',
    },

    ElementOfListWithoutMouse: {
        backgroundColor: '#f4f4f4',
        width: '100%',
        height: '9.2%',
        flexDirection: 'row',
        display: 'flex',
        marginTop: '0.5%',
        marginBottom: '0.25%'
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
    TextInListWithMouse: {
        fontSize: 20,
        color: '#f4f4f4',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    NameInElementWithMouse: {
        fontSize: 20,
        color: '#f4f4f4',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    ElementOfListWithMouse: {
        backgroundColor: '#2966b4',
        textDecoration: 'none',
        width: '100%',
        height: '9.2%',
        flexDirection: 'row',
        display: 'flex',
        marginTop: '0.25%',
        marginBottom: '0.25%'
    },


})

export default ListComponent
