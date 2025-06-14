import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '../constants'
import CustomButton from './CustomButton'
import * as Animatable from 'react-native-animatable'
import { SlideInUp } from 'react-native-reanimated'

const SorterComponent = ({ showSorter, sortButton }) => {

    // export example
    // {"data": null, "emri": "asc", "shikime": null}
    const [paginationOptions, setPaginationOptions] = useState({
        pageSizeOptions: [15, 30, 50],
        showPaginationOptions: false
    })
    
    const [sortableOptions, setSortableOptions] = useState([
        {
            id: 1,
            name: "Emri",
            selIcon: "name",
            ticked: false,
            underObj: [
                {
                    id: 1,
                    name: "Alfabeti (A-Zh)",
                    param: "asc",
                    selIcon: "asc",
                    ticked: false,
                },
                {
                    id: 2,
                    name: "Alfabeti (Zh-A)",
                    param: "desc",
                    selIcon: "desc",
                    ticked: false,
                }
            ]
        },
        {
            id: 2,
            name: "Data",
            selIcon: "calendar",
            ticked: false,
            underObj: [
                {
                    id: 1,
                    name: "Së fundmi",
                    param: "desc",
                    selIcon: "latest",
                    ticked: false,
                },
                {
                    id: 2,
                    name: "Së pari",
                    param: "asc",
                    selIcon: "oldest",
                    ticked: false,
                }
            ]
        },
        {
            id: 3,
            name: "Shikime",
            selIcon: "popular",
            ticked: false,
            underObj: [
                {
                    id: 1,
                    name: "Më së shumti",
                    param: "asc",
                    selIcon: "morePopular",
                    ticked: false
                },
                {
                    id: 2,
                    name: "Më së paku",
                    param: "desc",
                    selIcon: "lessPopular",
                    ticked: false,
                }
            ]
        }
    ])

    const [activeOptionId, setActiveOptionId] = useState(null)
    const [activeSubOptionId, setActiveSubOptionId] = useState(null)
    const [showButton, setShowButton] = useState(false)
    const [loadedFirst, setLoadedFirst] = useState(false)
    const [sendData, setData] = useState({
        emri: null,
        data: null,
        shikime: null,
        pageSize: 15
    })

    const setActiveButton = (id) => {
        setSortableOptions(prevOptions =>
            prevOptions.map(option =>
                option.id === id
                    ? { ...option, ticked: !option.ticked }
                    : { ...option, ticked: false }
            )
        )

        setActiveOptionId(id);
        setActiveSubOptionId(null);
    }

    const setActiveUnderButton = (mainId, subId) => {
        setSortableOptions(prevOptions =>
            prevOptions.map(option =>
                option.id === mainId
                    ? {
                        ...option,
                        underObj: option.underObj.map(subOption => {
                            if(subOption.id === subId) {
                                const newTicked = !subOption.ticked;
                                if(newTicked){
                                    setData(prevData => ({
                                        ...prevData,
                                        emri: option.name === "Emri" ? subOption.param : prevData.emri,
                                        data: option.name === "Data" ? subOption.param : prevData.data,
                                        shikime: option.name === "Shikime" ? subOption.param : prevData.shikime
                                    }))
                                }else{
                                    setData(prevData => ({
                                        ...prevData,
                                        emri: option.name === "Emri" ? null : prevData.emri,
                                        data: option.name === "Data" ? null : prevData.data,
                                        shikime: option.name === "Shikime" ? null : prevData.shikime
                                    }))
                                }
                                return { ...subOption, ticked: newTicked }
                            }else{
                                return { ...subOption, ticked: false }
                            }
                        })
                    } : option
            )
        )
        setActiveSubOptionId(prev => {
            if(prev === subId){
                return null
            }else{
                return subId
            }
        })        
    }

    useEffect(() => {
        // Check if any sub-option in any option is ticked
        const anySubTicked = sortableOptions.some(option => 
            option.underObj.some(subOption => subOption.ticked)
        );
        setShowButton(anySubTicked);
        
    }, [sortableOptions]);

    useEffect(() => {
        if(loadedFirst){
            setShowButton(true)
        }
    }, [sendData.pageSize])
    
    
    // const updateShowButton = () => {
    //     const anySubTicked = sortableOptions.some(option =>
    //         option.underObj.some(subOption => subOption.ticked)
    //     );
    //     setShowButton(!anySubTicked)
    // }

    const sendSortData = () => {
        sortButton(sendData);
    }
    
    if (!showSorter) return null;
    return (
        <>
        {paginationOptions.showPaginationOptions && <Animatable.View animation={"slideInLeft"} duration={500} className="flex-row flex-1">
            {/* <Text className=""></Text> */}
            {paginationOptions.pageSizeOptions.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => {setData((prev) => ({...prev, pageSize: item})); setLoadedFirst(true)}} className={`flex-1 ${item == sendData.pageSize ? "bg-oBlack" : "bg-primary"} flex-row gap-1 justify-center p-2 border-b-0 border items-center border-black-200 ${(index === 1 || index === 2) ? "border-l-0" : ""}`}>
                    <Text className="text-white text-sm font-plight"><Text className="text-secondary">{item}</Text> artikuj</Text>
                    {item == sendData.pageSize &&  <Image 
                        source={icons.tick}
                        className="size-5"
                        resizeMode='contain'
                        tintColor={"#FF9C01"}
                    />}
                </TouchableOpacity>
            ))}
        </Animatable.View>}
        <Animatable.View
            animation="slideInUp"
            duration={300}
        >
            <View className="flex-row w-full items-center justify-between">
                        {sortableOptions.map((option, index) => (
                            <View 
                                key={option.id}
                                className={`flex-1 border ${index === 1 || index === 2 ? "border-l-0" : ""} border-black-200 items-center p-2`}
                                style={{
                                    borderRightWidth: index < sortableOptions.length - 1 ? 1 : 0,
                                    borderColor: "#232533",
                                    backgroundColor: option.ticked ? "#13131a" : "transparent"
                                }}
                            >
                                <TouchableOpacity
                                    className="flex-row items-center gap-2"
                                    onPress={() => {setActiveButton(option.id)}}
                                >
                                    <Text className="text-white text-sm font-plight">
                                        {option.name}
                                    </Text>
                                    <Image 
                                        source={icons[option.selIcon]}
                                        className="h-4 w-4"
                                        resizeMode='contain'
                                        style={{tintColor: option.ticked ? "#ff9c01" : "#fff"}}
                                    />
                                </TouchableOpacity>
                                
                                
                            </View> 
                        ))}
                        <TouchableOpacity className="border border-black-200 p-2" onPress={() => setPaginationOptions((prev) => ({...prev, showPaginationOptions: !prev.showPaginationOptions}))}>
                            <Image 
                                source={icons.equalizer}
                                className="size-5"
                                tintColor={"#FF9C01"}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                    </View>

            {activeOptionId && (
                <>
                <View className={`w-full flex-row ${sortableOptions.find(option => option.id === activeOptionId && option.ticked) ? "border-b" : ""} border-l border-r border-black-200`}>
                    {sortableOptions
                        .find(option => option.id === activeOptionId && option.ticked)
                        ?.underObj.map((subOption, subIndex) => (
                        <View
                            key={subOption.id}
                            className="border-black-200 items-center flex-1"
                            style={{
                                borderRightWidth: subIndex < sortableOptions[0].underObj.length - 1 ? 1 : 0,
                                borderColor: "#232533",
                                backgroundColor: subOption.ticked ? "#13131a" : "transparent"
                            }}
                        >
                            <TouchableOpacity
                                className="flex-row items-center gap-2"
                                onPress={() => setActiveUnderButton(activeOptionId, subOption.id)}
                                >
                                <Text className="text-white text-xs font-plight py-2">
                                    {subOption.name}
                                </Text>
                                <Image 
                                    source={icons[subOption.selIcon]}
                                    className="h-4 w-4"
                                    resizeMode='contain'
                                    style={{tintColor: subOption.ticked ? "#ff9c01" : "#fff"}}
                                />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
                </>
            )}
            {showButton && 
            <CustomButton 
                title={"Ruaj të dhënat"}
                containerStyles={"!min-h-[30px] !rounded-none !border-l !border-b !border-r !border-black-200"}
                textStyles={"!text-white !text-sm !font-plight"}
                handlePress={sendSortData}
            />}
        </Animatable.View>
        </>
    )
}

export default SorterComponent