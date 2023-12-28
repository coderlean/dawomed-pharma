import React, { useEffect, useRef, useState } from 'react';
import { iconsSVGs } from '../../../assets/images/icons';
import Button from '../../atoms/Button';
import DropDown from '../../atoms/DropDown';
import TextInput from '../../atoms/TextInput';
import DatePicker from '../../molecules/DatePicker';
import LabeledTextInput from '../../molecules/LabeledTextInput';
import styles from "../../../pages/products/styles/styles.module.css"
import imagePlaceholder from "../../../assets/images/imagePlaceholder.png"
import Image from 'next/image';
import Loader from '../../atoms/Loader';
import ErrorBox from '../../atoms/ErrorBox';
import SuccessBox from '../../atoms/SuccessBox';
import { postProtected } from '../../../requests/postProtected';
import { putProtected } from '../../../requests/putProtected';
import { postProtectedMultiPart } from '../../../requests/postProtectedMultiPart';
import { putProtectedMultiPart } from '../../../requests/postProtectedMultiPart copy';

const CreateProduct = ({closeModal, activeCoupons, currentDrug, setDrugDetails, mode, fetchProducts, setCurrentDrugDetails, setMode, deleteDraft}) => {
    const [currentTab, setCurrentTab] = useState(0)
    const [draftLabel, setDraftLabel] = useState("Update draft")
    const [saveDraftLabel, setSaveDraftLabel] = useState("Save as draft")
    const [errorMessage, setErrorMessage] = useState("")
    const [createdProduct, setCreatedProduct] = useState(false)

    console.log({currentDrug});

    const setCurrentDrug = (drugDetails) => {
        setDrugDetails(drugDetails)
    }

    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        console.log({result: result.toISOString()});
        return String(result.toISOString()).split("T")[0];
      }

    const updateCurrentDrug = (field, value) => {
        console.log({field, value});
        const temp = {...currentDrug}
        temp[field] = value

        if (field === "sale_start_date" ) {
            console.log(Date(currentDrug.sale_start_date) >= Date(currentDrug.sale_end_date));
            if (currentDrug.sale_start_date && currentDrug.sale_end_date && Date(currentDrug.sale_start_date) >= Date(currentDrug.sale_end_date)) {
                temp["sale_end_date"] = addDays(value, 1)
            } else {
                temp["sale_end_date"] = addDays(value, 1)
            }
        }


        setCurrentDrug(temp)
    }

    const toPreviousTab = () => {
        if (currentTab > 0){
            setCurrentTab(currentTab - 1)
        }
    }

    const toNextTab = () => {
        if (currentTab < 3){
            setCurrentTab(currentTab + 1)
        } else {
            validateData()
        }
    }

    const validateData = () => {
        if (!currentDrug?.name){
            setErrorMessage("A product name is required")
        } else if (!currentDrug.reg_no){
            setErrorMessage("The registration number for this product is required")
        } else if (!currentDrug?.country_of_manufacture){
            setErrorMessage("The country of manufacture for this product is required")
        } else if (!currentDrug.description){
            setErrorMessage("A product description is required")
        } else if (!currentDrug.highlights){
            setErrorMessage("Product highlights is required")
        } else if (!currentDrug.price || currentDrug.price === 0){
            setErrorMessage("The product price is required")
        } else if (!currentDrug.quantity || currentDrug.quantity === 0){
            setErrorMessage("The available quantity in stock for this product is required")
        } else if (mode === "new" && (!currentDrug.image1 && !currentDrug.image2 && !currentDrug.image3 && !currentDrug.image4 && !currentDrug.image5 && !currentDrug.image6)){
            setErrorMessage("The product needs at least one image")
        } else {
            setCurrentTab(currentTab + 1)
            console.log({mode});
            createNewProduct()
        }
    }

    const generateProductData = () => {
        const productFormData = new FormData()
            
            productFormData.append("name", currentDrug?.name)
            productFormData.append("classification", currentDrug.classification)
            productFormData.append("presentation", "")
            productFormData.append("manufacturer", "")
            productFormData.append("reg_no", currentDrug.reg_no)
            productFormData.append("active_ingredients", currentDrug.active_ingredients)
            productFormData.append("applicantName", "")
            productFormData.append("country_of_manufacture", currentDrug?.country_of_manufacture)
            productFormData.append("quantity", currentDrug.quantity ? currentDrug.quantity : 0)
            productFormData.append("highlights", currentDrug.highlights ? currentDrug.highlights : "")
            productFormData.append("price", currentDrug.price ? currentDrug.price : 0)
            productFormData.append("sale_start_date", currentDrug.sale_start_date ? currentDrug.sale_start_date : "")
            productFormData.append("sale_end_date", currentDrug.sale_end_date ? currentDrug.sale_end_date : "")
            productFormData.append("discount_percentage", currentDrug.discount_percentage ? currentDrug.discount_percentage : 0)
            productFormData.append("coupon", currentDrug.coupon ? JSON.stringify(currentDrug.coupon) : "")
            productFormData.append("brand", currentDrug?.brand ? currentDrug?.brand : "")
            productFormData.append("description", currentDrug.description ? currentDrug.description : "")
            productFormData.append("in_the_box", currentDrug.in_the_box ? currentDrug.in_the_box : "")
            productFormData.append("approved_date", currentDrug.approved_date ? currentDrug.approved_date : "NOT AVAILABLE")
            productFormData.append("requires_prescription", (currentDrug.requires_prescription && currentDrug.requires_prescription === "Yes") ? true : false )


            currentDrug.image1 && productFormData.append("image1", currentDrug.image1)
            currentDrug.image1 && productFormData.append("image2", currentDrug.image2)
            currentDrug.image1 && productFormData.append("image3", currentDrug.image3)
            currentDrug.image1 && productFormData.append("image4", currentDrug.image4)
            currentDrug.image1 && productFormData.append("image5", currentDrug.image5)
            currentDrug.image1 && productFormData.append("image6", currentDrug.image6)

            return productFormData
    }

    const createNewProduct = async () => {
        try {
            
            const productFormData = generateProductData()
            console.log({mode});
            if (mode === "new" || !currentDrug._id) {
                createProduct(productFormData)
            } else if (mode === "edit") {
                updateProduct(productFormData)
            } else if (mode === "drafts") {
                updateDraft(productFormData)
            }
            

        } catch (error) {
            console.log({error});
        }
    }


    const createProduct = async (productData) => {
        console.log("Creating new");
        setErrorMessage("")
        const token = localStorage.getItem("userToken")

            const createProductResponse = await postProtectedMultiPart("product/new", productData)
            
            // await fetch("http://localhost:5000/product/new", {
            //     method : "POST",
            //     headers: {
            //         "authorization": `Bearer ${token}`
            //     },
            //     body : productData
            // })

            // const createProductResponse = await createProductRequest.json()

            console.log({createProductResponse});

            if (createProductResponse.success){
                setCreatedProduct(true)
                fetchProducts()

                if (mode === "drafts" || currentDrug._id){
                    deleteDraft(currentDrug._id)
                }
            } else {
                setCurrentTab(3)
                setErrorMessage("Could not create product. Make sure that all required fields are filled.")
            }
    }

    const updateProduct = async (productData) => {
            console.log("Updating");
            const token = localStorage.getItem("userToken")

            const createProductResponse = await putProtectedMultiPart(`product/${currentDrug._id}`, productData)
            
            // await fetch(`http://localhost:5000/product/${currentDrug._id}`, {
            //     method : "PUT",
            //     headers: {
            //         "authorization": `Bearer ${token}`
            //     },
            //     body : productData
            // })

            // const createProductResponse = await createProductRequest.json()
            console.log({createProductResponse});

            if (createProductResponse.success){
                setCreatedProduct(true)
                fetchProducts()
            } else {
                setCurrentTab(3)
                setErrorMessage("Could not update product. Make sure that all required fields are filled.")
            }
    }

    const updateDraft = async () => {
        const productData = generateProductData()
        const token = localStorage.getItem("userToken")

            const createProductResponse = await postProtectedMultiPart(`product/draft/${currentDrug._id}`, productData)
            
            // await fetch(`http://localhost:5000/product/draft/${currentDrug._id}`, {
            //     method : "PUT",
            //     headers: {
            //         "authorization": `Bearer ${token}`
            //     },
            //     body : productData
            // })

            // const createProductResponse = await createProductRequest.json()

            if (createProductResponse.success){
                    setDraftLabel("Draft updated")
    
                    setTimeout(() => {
                        setDraftLabel("Update draft")
                    }, 2000)
            } else {
                setCurrentTab(3)
                setErrorMessage("An error occured and your draft could not be updated.")
            }
    }

    const resetForm = () => {
        const temp = {...currentDrug}
        temp = {}
        setCurrentDrug(temp)

        setCreatedProduct(false)

        setCurrentTab(0)
    }

    const validateDrafts = () => {
        if (Object.values(currentDrug).length === 0){
            setErrorMessage("Cannot save an empty product as a draft")
        } else {
            
            if (mode === "drafts") {
                setDraftLabel("Updating draft...")
                updateDraft()
            } else {
                setSaveDraftLabel("Saving draft...")	
                createNewDraft()
            }
        }
    }

    const createNewDraft = async () => {
        const productData = generateProductData()
        const token = localStorage.getItem("userToken")

        try {
            const createDraftResponse = await postProtectedMultiPart("product/draft/new", productData)
            
            // await fetch("http://localhost:5000/product/draft/new", {
            //     method : "POST",
            //     headers: {
            //         "authorization": `Bearer ${token}`
            //     },
            //     body : productData
            // })

            // const createDraftResponse = await createDraftRequest.json()

            if (createDraftResponse.success){
                setSaveDraftLabel("Draft saved")
                setCurrentDrugDetails(createDraftResponse.product)
                setTimeout(() => {
                    setMode("drafts")
                }, 500)
            }
        } catch (error) {
            console.log({error});
        }
    }

    return (
        <div className='displayFlex'>
                    <div className={styles.createProductModal}>
                        {
                            currentTab !== 4 && <header className='displayFlex'>
                            <p className={currentTab === 0 ? styles.activeTab : styles.inactiveTab}>Product Info</p>
                            <p className={currentTab === 1 ? styles.activeTab : styles.inactiveTab}>More Product Details</p>
                            <p className={currentTab === 2 ? styles.activeTab : styles.inactiveTab}>Product Pricing</p>
                            <p className={currentTab === 3 ? styles.activeTab : styles.inactiveTab}>Images</p>
                        </header>
                        }

                        <div className='pl30 pr30'>
                        {
                            errorMessage && <ErrorBox errorMessage={errorMessage} closeErrorBox={() => setErrorMessage("")} />
                        }
                        </div>


                        {
                            currentTab === 0 && <ProductInfo mode={mode} currentDrug={currentDrug} setCurrentDrug={(drug) => {
                                const tempCurrentDrug = {...currentDrug}
                                tempCurrentDrug = drug
                                setCurrentDrug(tempCurrentDrug)
                            }} />
                        }

                        {
                            currentTab === 1 && <MoreProductDetails mode={mode} currentDrug={currentDrug} updateCurrentDrug={(field, value) => updateCurrentDrug(field, value)} />
                        }

                        {
                            currentTab === 2 && <ProductPricing activeCoupons={activeCoupons} mode={mode} currentDrug={currentDrug} updateCurrentDrug={(field, value) => updateCurrentDrug(field, value)} />
                        }

                        {
                            currentTab === 3 && <Images mode={mode} currentDrug={currentDrug} updateCurrentDrug={(field, value) => updateCurrentDrug(field, value)} />
                        }

                        {
                            currentTab === 4 && <CreatingProduct mode={mode} createdProduct={createdProduct} reset={() => {
                                resetForm()
                            }} >
                                {
                                    errorMessage && <ErrorBox errorMessage={errorMessage} closeErrorBox={() => setErrorMessage("")} />
                                }

                            </CreatingProduct>
                        }
                        

                        {
                            currentTab !== 4 && <React.Fragment>
                                <hr />

                                <footer className='pl40 pr40 displayFlex jcEnd pt10 pb10'>
                                    {
                                        currentTab !== 0 && <Button theme={"solid"} label={"Previous"} onButtonClick={() => toPreviousTab()} />
                                    }
                                    
                                    {
                                         <Button theme={"outline"} label={currentTab !== 3 ? "Next" : (mode === "new" || mode === "edit") ? "Submit and Finish" : "Save as new product"} onButtonClick={() => toNextTab()} />
                                    }

                                    {
                                        mode !== "edit" && <React.Fragment>
                                            {
                                                (mode === "new") && <Button theme={"outline"} label={saveDraftLabel} onClick={() => validateDrafts()} />
                                            }

                                            {
                                                (mode === "drafts") && <Button theme={"solid"} type="button" label={draftLabel} onClick={() => validateDrafts()} />
                                            }
                                        </React.Fragment>
                                    }
                                </footer>
                            </React.Fragment>
                        }
                    </div>

                    <div onClick={() => closeModal()}>
                        {iconsSVGs.closeIconWhite}
                    </div>

                    
                    
                </div>
    )
}

const ProductInfo = ({currentDrug, mode, setCurrentDrug, updateCurrentDrug}) => {
    const [query, setQuery] = useState("")
    const [drugSearchResults, setDrugSearchResults] = useState([])
    const [searching, setSearching] = useState(false)
    const [selecting, setSelecting] = useState(false)

    const findDrugs = async (drug_name) => {
        setQuery(drug_name)
        try {
            const searchDrugsListResponse = await postProtected("product/drugs/search", {query: drug_name})
            
            // await fetch("http://localhost:5000/product/drugs/search", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify({query: drug_name})
            // })

            // const searchDrugsListResponse = await searchDrugsListRequest.json()

            const tempDrugSearchResults = [...drugSearchResults]
            tempDrugSearchResults = searchDrugsListResponse.data
            setDrugSearchResults(tempDrugSearchResults)
        } catch (error) {
            console.log({error});
        }
    }


    return (
        <div className={styles.pageContent}>

            <h2>CREATE NEW PRODUCT</h2>

            <form className={styles.drugsSearchDiv} onFocus={() => setSelecting(true)} onSubmit={event => findDrugs(event)} onChange={(event) => findDrugs(event.target.value)} >
                <LabeledTextInput label={"Product Name*"}>
                    <TextInput value={currentDrug?.name} placeholder={"MELOFAN PLUS"} />
                </LabeledTextInput>

                {
                    ((drugSearchResults.length > 0) && query && selecting) && <div className={styles.drugsResultsDropDown}>
                    {
                        drugSearchResults.map((item, index) => <div  key={index}>
                            <p onClick={() => {
                                setCurrentDrug(item)
                                setSelecting(false)
                            }}>{item?.name}</p>
                        </div>)
                    }
                </div>
                }
            </form>

            <div className='displayFlex jcSpaceBetween horizontalHalf pb20 pt20'>
                <LabeledTextInput label={"Presentation"}>
                    <TextInput disabled={true} value={mode === "new" ? currentDrug.dosage : currentDrug?.presentation} placeholder={"Presentation"} />
                </LabeledTextInput>

                <LabeledTextInput label={"Brand"}>
                    <TextInput disabled={true} value={currentDrug?.brand} placeholder={"Brand"} />
                </LabeledTextInput>
            </div>

            <div className='displayFlex jcSpaceBetween horizontalHalf pb20'>
                <LabeledTextInput label={"Applicant Name"}>
                    <TextInput placeholder={"Applicant Name"} />
                </LabeledTextInput>

                <LabeledTextInput label={"Country"}>
                    <TextInput disabled={true} value={currentDrug?.country_of_manufacture} placeholder={"Country"} />
                </LabeledTextInput>
            </div>

            <div className='displayFlex jcSpaceBetween horizontalHalf pb20'>
                <LabeledTextInput label={"Manufacturer"}>
                    <TextInput placeholder={"Manufacturer"} />
                </LabeledTextInput>

                <LabeledTextInput label={"Date Approved"}>
                    <TextInput disabled={true} value={currentDrug.approved_date} placeholder={"Date Approved"} />
                </LabeledTextInput>
            </div>

            <LabeledTextInput label={"Registration Number"}>
                    <TextInput disabled={true} value={currentDrug.reg_no} placeholder={"B7-123"} />
            </LabeledTextInput>

        </div>
    )
}

const MoreProductDetails = ({updateCurrentDrug, currentDrug, mode}) => {
    const updateDrugDetails = updateDrugEvent => {
        const field = updateDrugEvent.target?.name
        const value = updateDrugEvent.target.value

        updateCurrentDrug(field, value)
    }


    return (
        <div className={styles.pageContent}>
            <h2>More Product Details</h2>

            <form onChange={event => updateDrugDetails(event)}>
                <div className='displayFlex jcSpaceBetween horizontalHalf'>
                    <LabeledTextInput label={"Product Description *"}>
                        <TextInput value={currentDrug.description} name="description" type={"textarea"} />
                        <p className={styles.infoText}>The product description should give the customer useful information about the product to ensure a purchase. </p>
                    </LabeledTextInput>

                    <LabeledTextInput label={"Highlights *"}>
                        <TextInput value={currentDrug.highlights} name="highlights" type={"textarea"} />
                        <p className={styles.infoText}>Enter short major highlights of the product, to make the purchase decision for the customer easier. Paste http://bit.ly/3ahLVGX into your browser for more information</p>
                    </LabeledTextInput>
                </div>

                <div className='displayFlex jcSpaceBetween horizontalHalf'>
                    <LabeledTextInput label={"What's in the box"}>
                        <TextInput value={currentDrug.in_the_box} name="in_the_box" type={"textarea"} />
                        <p className={styles.infoText}>Short summary/list of the package content, which the customer gets.</p>
                    </LabeledTextInput>

                    <LabeledTextInput label={"Active Ingredients"}>
                        <TextInput disabled={true} value={currentDrug.active_ingredients} type={"textarea"} />
                        <p className={styles.infoText}>Possibility to enter some comments or additional information about the product. Example: Choking Hazard: Not for children under 3 years</p>
                    </LabeledTextInput>
                </div>

                <LabeledTextInput label={"Requires Prescription"}>
                    <DropDown defaultValue={"No"} options={["No", "Yes"]} name="requires_prescription" />
                </LabeledTextInput>
            </form>
        </div>
    )
}

const ProductPricing = ({updateCurrentDrug, currentDrug, activeCoupons, mode}) => {
    const [activeCouponNames, setActiveCouponNames] = useState([])

    useEffect(() => {
        const temp = {... activeCouponNames}
        temp = activeCoupons.map(item => `${item?.name} (${item.percentage}% off)`)
        setActiveCouponNames(temp)
    }, [])

    const updateDrugDetails = updateDrugEvent => {
        const field = updateDrugEvent.target?.name
        let value = updateDrugEvent.target.value 

        console.log(activeCouponNames.indexOf(value));
        console.log({coupon: activeCoupons[activeCouponNames.indexOf(value)]});

        if (field === "coupon") {
            value = activeCoupons[activeCouponNames.indexOf(value)]
        }

        updateCurrentDrug(field, value) 
    }

    const getDiscountedPrice = () => {
        if (currentDrug.price && currentDrug.discount_percentage && (Number(currentDrug.discount_percentage) <= 100)){
            const discounted_price = currentDrug.price - ((Number(currentDrug.discount_percentage)/100) * currentDrug.price)

            return discounted_price
        } else {
            return 0
        }
    }


    return (
        <div className={styles.pageContent}>
            <h2>PRODUCT PRICING</h2>

            <form onChange={(event) => updateDrugDetails(event) }>
                <div className='displayFlex jcSpaceBetween horizontalHalf'>
                    <LabeledTextInput label={"Sales Price"}>
                        <TextInput name="price" value={currentDrug.price}  />
                    </LabeledTextInput>

                    <LabeledTextInput label={"Quantity"}>
                        <TextInput  name="quantity" value={currentDrug.quantity}  />
                    </LabeledTextInput>
                </div>

                <div className='displayFlex jcSpaceBetween horizontalHalf pt20'>
                    <LabeledTextInput label={"Discount Percentage/Price"}>
                        <span className={styles.discount}>
                            <input defaultValue={currentDrug.discount_percentage} name="discount_percentage" max="100" placeholder='%' />
                            <div>
                                {`N ${getDiscountedPrice()}`}
                            </div>
                        </span>
                    </LabeledTextInput>

                    <LabeledTextInput label={"Select Coupon Code"}>
                        <DropDown defaultValue={currentDrug?.coupon?.code} name="coupon" options={activeCouponNames} placeholder={"Health Week"} />
                    </LabeledTextInput>
                </div>

                <div className='displayFlex jcSpaceBetween horizontalHalf pt20'>
                    <LabeledTextInput label={"Sale Start Date"}>
                        <DatePicker defaultValue={currentDrug.sale_start_date} name="sale_start_date" />
                    </LabeledTextInput>

                    <LabeledTextInput label={"Sale End Date"}>
                        <DatePicker defaultValue={currentDrug.sale_end_date} min={currentDrug.sale_start_date ? currentDrug.sale_start_date : null} name="sale_end_date" minRequired={true} />
                    </LabeledTextInput>
                </div>
            </form>
        </div>
    )
}

const Images = ({currentDrug, updateCurrentDrug, mode}) => {
    const updateDrugDetails = (updateDrugEvent) => {
        const field = updateDrugEvent.target?.name
        const value = updateDrugEvent.target.files[0]
        updateCurrentDrug(field, value)
    }
    
    return (
        <div className={styles.pageContent}>
            <h2>PRODUCT IMAGES</h2>

            <form onChange={(event) => updateDrugDetails(event)}>
                <div className='displayFlex jcSpaceBetween horizontalThird'>
                    <ImageSelectorItem value={currentDrug.image1} editImage={currentDrug.images ? currentDrug?.images[0] : ""} name="image1" />
                    <ImageSelectorItem value={currentDrug.image2} editImage={currentDrug.images ? currentDrug?.images[1] : ""} name="image2" />
                    <ImageSelectorItem value={currentDrug.image3} editImage={currentDrug.images ? currentDrug?.images[2] : ""} name="image3" />
                </div>

                <div className='displayFlex jcSpaceBetween horizontalThird pt20'>
                    <ImageSelectorItem value={currentDrug.image4} editImage={currentDrug.images ? currentDrug?.images[3] : ""} name="image4" />
                    <ImageSelectorItem value={currentDrug.image5} editImage={currentDrug.images ? currentDrug?.images[4] : ""} name="image5" />
                    <ImageSelectorItem value={currentDrug.image6} editImage={currentDrug.images ? currentDrug?.images[5] : ""} name="image6" />
                </div>
            </form>
        </div>
    )
}

const ImageSelectorItem = ({name, value, editImage}) => {
    const fileSelectorRef = useRef(null)
    const [currentImage, setCurrentImage] = useState(imagePlaceholder)
    const [selectedFile, setSelectedFile] = useState("")


    const encodeImageFileAsURL = () => {
        var filesSelected = fileSelectorRef.current.files;
    
        // onFileSelect(filesSelected[0])
    
        if (filesSelected.length === 1) {
          var fileToLoad = filesSelected[0];
        //   setSelectedFile(filesSelected[0]);
    
          var fileReader = new FileReader();
    
          fileReader.onload = function (fileLoadedEvent) {
            var srcData = fileLoadedEvent.target.result; // <--- data: base64
            // console.log(srcData);
            // onFileSelect(fileToLoad)
          };
    
          fileReader.readAsDataURL(fileToLoad);
        }
      };

    return (
        <div className={styles.imageSelector}>
            <Image src={value ? URL.createObjectURL(value) : editImage ? editImage :  currentImage} width={100} height={100} objectFit='covers' alt="product image" />

            <p>{"Drag & Drop your file"}</p>

            <Button type={"button"} label={"Browse To Upload"} onButtonClick={() => {
                fileSelectorRef.current.click()
            }} />

            <input name={name} type={"file"} ref={fileSelectorRef} 
                onChange={(picSelector) => {
                // encodeImageFileAsURL();
                var reader = new FileReader();
              
                reader.onload = function (e) {
                // get loaded data and render thumbnail.

                setCurrentImage(e.target.result)
              
                // console.log(e.target.result);
                };
              
                // read the image file as a data URL.
                reader.readAsDataURL(picSelector.target.files[0]);
                }}
            />
        </div>
    )
}

const CreatingProduct = ({reset, createdProduct, mode}) => {
    return (
        <div className={styles.creatingProduct}>
            <p className={styles.createdProductTitle}>{mode === "new" ? "Creating Product" : "Updating Product"}</p>

            {
                !createdProduct && <Loader />
            }

            <div className={styles.successBox}>
            {
                createdProduct && <p>{mode === "new" ? "Product created successfully." : "Product updated successfully."}</p>
            }
            </div>

            {
                mode === "new" && <div>
                <Button onButtonClick={() => reset()} label={"Create Another Product"} />
                </div>
            }


        </div>
    )
}

export default CreateProduct