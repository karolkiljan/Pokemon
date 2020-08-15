import React, {useState, useEffect}from "react"
import {createUseStyles} from "react-jss";
import logo from "../pictures/pokemonLogo.png";
import {Link, NavLink, useParams} from "react-router-dom";
import {RowTextElement} from "./ListComponent";


const Row = (props) => {
    const classes = useStyles()
    return (
        <div className={classes.ElementOfList}>
            <StatName content={props.contentName}/>
            <StatValue content={props.contentNameVal}/>
        </div>
    )
}

const TitleText = (props) => {
    const classes = useStyles()
    return (
        <div className={props.style}>
            <p className={classes.Title}>{props.content}</p>
        </div>
    )
}

const StatName = (props) => {
    const classes = useStyles()
    return (
        <div className={classes.NameComponent}>
            <RowTextElement style={classes.IdInList} content={props.content}/>
        </div>
    )
}

const StatValue = (props) => {
    const classes = useStyles()
    return (
        <div className={classes.ValueComponent}>
            <RowTextElement style={classes.IdInList} content={props.content}/>
        </div>
    )
}
const StatsComponent = (props) => {
    const classes = useStyles()
    const {attack, defense, spAttack, spDefense, hp} = props.stats
    return (
        <div className={classes.StatsComponent}>
            <div>
                <div className={classes.HeaderOfList}>
                    <TitleText style={classes.IdInList} content={'Growth'} />
                </div>
                <Row style={classes.IdInList} contentName={'attack'} contentNameVal={attack} />
                <Row style={classes.IdInList} contentName={'defense'} contentNameVal={defense} />
                <Row style={classes.IdInList} contentName={'spAttack'} contentNameVal={spAttack} />
                <Row style={classes.IdInList} contentName={'spDefense'} contentNameVal={spDefense} />
                <Row style={classes.IdInList} contentName={'hp'} contentNameVal={hp} />
            </div>
        </div>
    )
}

const LogoComponent = () => {
    const classes = useStyles()
    return <div className={classes.LogoComponent}/>
}

const PictureComponent = (props) => {
    const classes = useStyles()
    return (
        <img src={props.picture} className={classes.PictureComponent}/>
    )
}

const DescriptonComponent = (props) => {
    const classes = useStyles()
    return (
        <div className={classes.DescriptonComponent}>
            <p className={classes.DescriptionText}>{props.description}</p>
        </div>
    )
}

const BackComponent = () => {
    const classes = useStyles()
    return (
        <NavLink to={'/'} className={classes.Back}>
            <p className={classes.Title}>{'Back'}</p>
        </NavLink>
    )
}

const NameComponent = (props) => {
    const classes = useStyles()
    let id
    if( parseInt(props.id) > 99){
        id = props.id
    } else {
        if(parseInt(props.id) > 9){
            id = '0' + props.id
        } else {
            id = '00' + props.id
        }
    }
    return (
        <div className={classes.Name}>
            <p className={classes.TitleName}>{`${id} ${props.name}`}</p>
        </div>
    )
}

const NextComponent = (props) => {
    const classes = useStyles()
    return (
        <NavLink to={`/${parseInt(props.id) + 1}`} className={classes.Next}>
            <p className={classes.Title}>{'Next'}</p>
        </NavLink>
    )
}

const BottomComponent = (props) => {
    const classes = useStyles()
    return (
        <div className={classes.BottomComponent}>
            <BackComponent />
            <NameComponent id={props.id} name={props.name} />
            <NextComponent id={props.id} />
        </div>
    )
}



const DetailsComponent = () => {
    let { id } = useParams()
    const classes = useStyles()
    const [statsFromPokemon, setStatsFromPokemon] = useState({
        attack: '',
        defense: '',
        spAttack: '',
        spDefense: '',
        hp: 0,
        types: [],
        idBottom: '',
        picture: '',
        name: ''
    })
    const [pokeDescription, setPokeDescription] = useState('')
    const [number, setNumber] = useState(id)

    // const [picture, setPicture] = useState('')


    useEffect (()=> {
        const getGrows = (json) => {
            let localStats = Object()
            json.stats.forEach(obj => {
                switch (obj.stat.name){
                    case 'attack':
                        localStats['attack'] = obj.base_stat
                        break
                    case 'defense':
                        localStats['defense'] = obj.base_stat
                        break
                    case 'special-defense':
                        localStats['spDefense'] = obj.base_stat
                        break
                    case 'special-attack':
                        localStats['spAttack'] = obj.base_stat
                        break
                    case 'hp':
                        localStats['hp'] = obj.base_stat
                        break
                }
            })
            return localStats
        }

        const getDescription = (json) => {
            let text = ''
            // json.forEach((obj) => {
            //     if(obj.language.name === 'en')
            //         text += obj.flavor_text
            // })
            text = json[0].flavor_text + json[4].flavor_text
            return text
        }

        const getTypes = (json) => {
            return Array(json.types.map(obj => obj.type.name))
        }

        // name, picture, attack, defense, spAttack, spDefence, speed, hp
        const getDataFromPokemon = async () => {
            const details = await fetch('https://pokeapi.co/api/v2/pokemon/' + id)
            const detailsJson = await details.json()

            let picture = detailsJson.sprites.other
            picture = picture['official-artwork']
            picture = picture.front_default

            let data = getGrows(detailsJson)
            let types = getTypes(detailsJson)
            console.log('siema',{...data, picture, types})

            let name = detailsJson.name

            setStatsFromPokemon({
                attack: '+' + data.attack,
                defense: '+' + data.defense,
                spAttack: '+' + data.spAttack,
                spDefense: '+' + data.spDefense,
                hp: '+' + data.hp,
                types: types,
                picture: picture,
                name: name.toUpperCase()
            })
        }
        // gets picture
        const getDataFromSpecies = async () => {
            const pokemonSpecies = await fetch('https://pokeapi.co/api/v2/pokemon-species/' + id)
            const pokemonSpeciesJson = await pokemonSpecies.json()

            let idBottom

            if(parseInt(id) > 99){
                idBottom = id
            } else {
                if(parseInt(id) > 9){
                    idBottom = '0' + id
                } else {
                    idBottom = '00' + id
                }
            }
            let description = getDescription(pokemonSpeciesJson.flavor_text_entries)
            console.log({idBottom, description})
            setPokeDescription(description)
        }

        const dataFromPokemon = getDataFromPokemon()
        const dataFromSpecies = getDataFromSpecies()

        const data = {...dataFromPokemon, ...dataFromSpecies}

        setPokeDescription(data.description)


    }, [number])

    return (
        <div className={classes.DetailsComponent}>
            <LogoComponent />
            <div className={classes.MidContainer}>
                <StatsComponent stats={statsFromPokemon}/>
                <PictureComponent picture={statsFromPokemon.picture}/>
                <DescriptonComponent description={pokeDescription}/>
            </div>
            <BottomComponent name={statsFromPokemon.name} id={id}/>
        </div>
    )
}

const Wrapper = (props) =>
    (<div className={props.classes.DetailsComponent}>
        <LogoComponent />
        <div className={props.classes.MidContainer}>
            <StatsComponent stats={props.statsFromPokemon}/>
            <PictureComponent picture={props.statsFromPokemon.picture}/>
            <DescriptonComponent description={props.pokeDescription}/>
        </div>
        <BottomComponent name={props.statsFromPokemon.name} id={props.id}/>
    </div>
    )

const useStyles = createUseStyles({
    DetailsComponent: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },
    LogoComponent: {
        marginTop: '3%',
        height: '20%',
        backgroundImage: `url(${logo})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    },
    StatsComponent: {
      width: '25%',
      height: '75%',
    },
    MidContainer: {
        height: '70%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: '5%'
    },
    PictureComponent: {
        width: '50%',
        height: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        objectFit: 'contain',
        textAlign: 'center',
    },
    DescriptonComponent: {
        width: '25%',
        height: '75%',
        // backgroundColor: 'green'
        objectFit: 'contain',
        marginRight: '5%'
    },
    BottomComponent: {
        height: '15%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: '5%',
        paddingRight: '5%'
    },
    IdInList: {
        width: '10%',
        height: '100%',
        textAlign: 'center',
        justifyContent: 'space-between',
        objectFit: 'contain',
    },
    HeaderOfList: {
        backgroundColor: '#f9e01d',
        height: '7%',
        flexDirection: 'row',
        display: 'flex',
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: '10%',
        marginLeft: '0.5%',
        marginRight: '0.5%',
    },
    ElementOfList: {
        width: '100%',
        height: '9.2%',
        flexDirection: 'row',
        display: 'flex',
        // justifyContent: 'space-between',
    },
    NameComponent: {
        display:'flex',
        width: '60%',
        backgroundColor: '#f4f4f4',
        paddingLeft: '10%',
        margin: '0.5%',
    },
    ValueComponent: {
        width: '40%',
        display:'flex',
        backgroundColor: '#f4f4f4',
        justifyContent: 'center',
        margin: '0.5%',
        textAlign: 'center',
    },
    DescriptionText: {
        fontSize: 16,
        color: '#2966b4',
        fontWeight: 'bold',
    },
    Title: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#2966b4',
        alignItems: 'stretch'
    },

    Back: {
        width: '33%',
        height: '100%',
        justifySelf: 'start'
    },

    Next: {
        width: '33%',
        height: '100%',
        textAlign: 'end',
        justifySelf: 'end',
        alignItems: 'stretch'
    },

    Name: {
        marginBottom: '10%',
        width: '34%',
        height: '100%',
        textAlign: 'center',
        justifySelf: 'end'
    },
    BackButton: {
        backgroundColor: 'yellow',
        width: '35%',
        height: '10%'
    },
    TitleName: {
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: 55,
        color: '#2966b4',
    }

})

export default DetailsComponent

