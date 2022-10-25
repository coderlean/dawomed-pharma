import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { iconsSVGs } from '../../assets/images/icons';
import LoggedInLayout from '../../components/layouts/LoggedInLayout/loggedinLayout';
import styles from "./styles/styles.module.css";
import drugImage from "../../public/drug.png";
import Image from 'next/image';
import Modal from '../../components/layouts/Modal';

import Button from '../../components/atoms/Button';
import Loader from '../../components/atoms/Loader';
import LabeledTextInput from '../../components/molecules/LabeledTextInput';
import TextInput from '../../components/atoms/TextInput';
import DatePicker from '../../components/molecules/DatePicker';
import ErrorBox from '../../components/atoms/ErrorBox';
import CreateProduct from '../../components/create-product-components/components/createProduct';
import TransparentLoader from '../../components/atoms/TransparentLoader';

const getCapitalizedString  = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const getLocaleDate = (date) => {
    const localeDate = new Date(date);
    return localeDate.toLocaleDateString();
}

const Products = () => {
    const [activeTab, setActiveTab] = useState("all")
    const [showNewProductModal, setShowNewProductModal] = useState(false)
    const [currentDrug, setCurrentDrug] = useState({})
    const [showUploadProductMenu, setShowUploadProductMenu] = useState()
    const [fetchedProducts, setFetchedProducts] = useState(false)
    const [products, setProducts] = useState([])
    const [showUploadProductsButtons, setShowUploadProductsButtons] = useState(false)
    const [mode, setMode] = useState("new")
    const [productsToDelete, setProductsToDelete] = useState([])
    const [stock, setStock] = useState({
        inStock: [],
        outOfStock: []
    })
    const [coupon, setCoupon] = useState({})
    const [couponErrorMessage, setCouponErrorMessage] = useState(false)
    const [creatingCoupon, setCreatingCoupon] = useState(false)
    const [coupons, setCoupons] = useState([])
    const [activeCoupons, setActiveCoupons] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const pharmacyId = JSON.parse(localStorage.getItem("user"))._id

            const user = JSON.parse(localStorage.getItem("user"))

            setLoading(true)


            const fetchProductsRequest = await fetch("http://localhost:5000/product/pharmacy/all", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({pharmacyId: pharmacyId})
            })

            const fetchProductsResponse = await fetchProductsRequest.json()

            setLoading(false)

            const temp = [...products]
            temp = fetchProductsResponse.products
            setProducts(temp)

            temp = {...stock}

            fetchProductsResponse.products.forEach(product => {
                if (Number(product.quantity) === Number(product.sold)) {
                    temp.outOfStock.push(product)
                } else {
                    temp.inStock.push(product)
                }
            })

            temp = {...coupons}
            temp = fetchProductsResponse.coupons
            setCoupons(temp)

            temp = {...activeCoupons}
            temp = fetchProductsResponse.activeCoupons
            setActiveCoupons(temp)
        } catch (error) {
            console.log({error});
        }
    }

    const fetchDrafts = async () => {
        try {
            const pharmacyId = JSON.parse(localStorage.getItem("user"))._id

            const fetchProductsRequest = await fetch("http://localhost:5000/product/pharmacy/drafts/all", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({pharmacyId: "62a12f4cc56f56c9f6b14c28"})
            })

            const fetchProductsResponse = await fetchProductsRequest.json()

            const temp = [...products]
            temp = fetchProductsResponse.products
            setProducts(temp)

            console.log({fetchProductsResponse});
        } catch (error) {
            console.log({error});
        }
    }

    const addProductToDelete = (product_id) => {
        setProductsToDelete([...productsToDelete, product_id])
    }

    const clearProductsToDelete = () => {
        const temp = [...productsToDelete]
        temp = []
        setProductsToDelete(temp)
    }

    const updateCouponDetails = (updateCouponEvent) => {
        const field = updateCouponEvent.target.name
        const value = updateCouponEvent.target.value

        const temp = {...coupon}
        temp[field] = value
        setCoupon(temp)
    }

    const deleteDraft = async (draftID) => {
        try {
            const token = localStorage.getItem("userToken")
            const deleteDraftRequest = await fetch(`http://localhost:5000/product/draft/${draftID}`, {
                method: "DELETE",
                headers: {
                    "authorization": `Bearer ${token}`
                }
            })

            const deleteDraftResponse = await deleteDraftRequest.json()

            if (deleteDraftResponse.success || productsToDelete.length > 0) {
                const temp = [...productsToDelete]
                temp = []
                setProductsToDelete(temp)
            }
        } catch (error) {
            console.log({error})
        }
    }

    const validateCoupon = () => {
        if (!coupon.name){
            setCouponErrorMessage("Name is required")
            return
        } else if (!coupon.code){
            setCouponErrorMessage("Code is required")
            return
        } else if (!coupon.start_date){
            setCouponErrorMessage("Start date is required")
            return
        } else if (!coupon.expiry_date){
            setCouponErrorMessage("Expiry date is required")
            return
        } else if (!coupon.percentage){
            setCouponErrorMessage("Percentage is required")
            return
        } else {
            setCreatingCoupon("creating")
            setCouponErrorMessage("")
            createCoupon()
        }
    }

    const createCoupon = async () => {
        try {
            const token = localStorage.getItem("userToken")

            const createCouponRequest = await fetch("http://localhost:5000/coupon/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify(coupon)
            })

            const createCouponResponse = await createCouponRequest.json()

            if (createCouponResponse.success) {
                setCreatingCoupon("created")
            } else {
                setCreatingCoupon(true)
                setCouponErrorMessage(createCouponResponse.error)
            }
        } catch (error) {
            console.log({error});
        }
    }

    console.log({creatingCoupon});

    

    return (
        <div className={styles.products}>
            <Head>
                <title>Products | Dawomed</title>
            </Head>

            {
                showNewProductModal && <Modal>
                    <CreateProduct activeCoupons={activeCoupons} setMode={newMode => {
                        setMode(newMode)
                    }}

                    deleteDraft={(draftId => {
                        deleteDraft(draftId)
                    })}
                    
                    setCurrentDrugDetails={drug => {
                        const temp = {...currentDrug}
                        temp = drug
                        setCurrentDrug(temp)
                    }}
                    
                    fetchProducts={() => fetchProducts()} mode={mode} closeModal={() => {
                        const temp = {...currentDrug}
                        temp = {}
                        setCurrentDrug(temp)
                        setShowNewProductModal(false)
                    }} setDrugDetails={newDrugDetails => setCurrentDrug(newDrugDetails)} currentDrug={currentDrug} />
                </Modal>
            }

            {
                productsToDelete.length > 0 && <Modal>
                    <DeleteProduct mode={mode} deleteDraft={draftID => deleteDraft(draftID)} fetchProducts={() => fetchProducts()} productsToDelete={productsToDelete} onCancel={() => clearProductsToDelete()} />
                </Modal>
            }

            {
                creatingCoupon !== false && <Modal>
                <div className={styles.createCouponContainer}>
                    <h3>CREATE COUPON</h3>

                    <hr />

                    <div className={styles.errorContainer}>
                    {
                        couponErrorMessage && <ErrorBox errorMessage={couponErrorMessage} closeErrorBox={() => setCouponErrorMessage("")} />
                    }
                    </div>

                    {
                        creatingCoupon === true && <form onChange={event => updateCouponDetails(event)} onSubmit={event => {
                            event.preventDefault()
                            const temp = {...coupon}
                            temp["status"] = "active"
                            setCoupon(temp)
                            validateCoupon()
                        }} className={styles.createCouponForm}>
                        <div className={styles.couponCreateFormContainer}>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <LabeledTextInput label={"Name of Coupon"}>
                                            <TextInput name="name" value={coupon.name} />
                                        </LabeledTextInput>
                                    </td>

                                    <td>
                                        <LabeledTextInput label={"Coupon Code"}>
                                            <TextInput name="code" value={coupon.code} pattern="[a-zA-Z]*" maxLength={10} />
                                        </LabeledTextInput>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <LabeledTextInput label={"Start Date"}>
                                            <DatePicker defaultValue={coupon.start_date} name="start_date" />
                                        </LabeledTextInput>
                                    </td>

                                    <td>
                                        <LabeledTextInput label={"Expiration Date"}>
                                        <DatePicker defaultValue={coupon.expiry_date} name="expiry_date" />
                                        </LabeledTextInput>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <LabeledTextInput label={"Percentage"}>
                                            <TextInput value={coupon.percentage} name="percentage" type={"number"} placeholder="%" />
                                        </LabeledTextInput>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        </div>

                        <hr />

                        <div className={styles.couponActionButtons}>
                            <Button label={"Cancel"} type="button" theme="outline" onClick={() => setCreatingCoupon(false) } />
                            <Button label={"Save As Draft"} type="button" theme="outline" onClick={() => {
                                const temp = {...coupon}
                                temp["status"] = "draft"
                                setCoupon(temp)
                                validateCoupon()
                            }} />
                            <Button label={"Save Coupon"}  />
                        </div>
                    </form>
                    }

                    {
                        creatingCoupon === "creating" && <div className='displayFlex jcCenter alignCenter'>
                            <Loader />
                            </div>
                    }

                    {
                        creatingCoupon === "created" && <div className={styles.couponCreated}>
                        <div>
                            <p>{coupon.status === "draft" ? "Saved draft" : "Coupon Created"}</p>

                            {
                                iconsSVGs.successGreen
                            }

                            {
                                coupon.status !== "draft" && <p>{coupon.code.toUpperCase()}</p>
                            }

                            <Button onClick={() => setCreatingCoupon(false)} label={"Close"} />
                        </div>
                    </div>
                    }

                    


                </div>
            </Modal>
            }
            
            <header className='displayFlex'>
                <div className={styles.headerOptions}>
                    <div className='displayFlex alignCenter' onClick={() => {
                        setMode("new")
                        setShowNewProductModal(true)
                    }} >
                        {iconsSVGs.addIconLightPrimary}
                        <p>Add Product</p>
                    </div>

                    <div  className={['displayFlex alignCenter', styles.uploadProductNavItem].join(" ")}>
                        <span onClick={() => setShowUploadProductMenu(true)} className='displayFlex alignCenter'>
                        {iconsSVGs.downloadLightPrimary}
                        <p>Import Product</p>
                        {iconsSVGs.dropCaretGrey}
                        </span>

                        <div>
                            
                        </div>

                        {
                            showUploadProductMenu && <div className={styles.uploadProductMenu}>
                            <div onClick={() => {
                                setShowUploadProductMenu(false)
                            }}>
                                {
                                    iconsSVGs.downloadLightPrimary
                                }
                                <p>Upload Product - Excel Template</p>
                            </div>

                            <div>
                                {
                                    iconsSVGs.downloadLightPrimary
                                }
                                <p>Download Excel Template</p>
                            </div>
                        </div>
                        }
                    </div>
                </div>

                <div className={[styles.headerTabs, 'displayFlex'].join("  ")}>
                    <p className={activeTab === "all" ? styles.active : styles.inactive} onClick={() => {
                        setActiveTab("all")
                        setMode("new")
                        fetchProducts()
                    }}>All Products</p>

                    <p className={activeTab === "drafts" ? styles.active : styles.inactive} onClick={() => {
                        fetchDrafts()
                        setMode("drafts")
                        setActiveTab("drafts")
                    }}>Drafts</p>

                    <p className={activeTab === "in stock" ? styles.active : styles.inactive} onClick={() => {
                        const temp = {...products}
                        temp = stock.inStock
                        setProducts(temp)
                        setActiveTab("in stock")
                    }}>In Stock</p>

                    <p className={activeTab === "out of stock" ? styles.active : styles.inactive} onClick={() => {
                        const temp = {...products}
                        temp = stock.outOfStock
                        setProducts(temp)
                        setActiveTab("out of stock")
                    }}>Out of Stock</p>

                    <p className={activeTab === "coupons" ? styles.active : styles.inactive} onClick={() => setActiveTab("coupons")}>Coupons</p>
                </div>
            </header>

            <div className={[styles.searchDiv, 'displayFlex jcEnd pt20 pb20'].join(" ")}>
                <div className={[styles.search, "displayFlex alignCenter mr10"].join(" ")}>
                    <input placeholder='Search' />
                    {iconsSVGs.searchIconGrey}
                </div>

                <div className={[styles.sort, "displayFlex alignCenter mr10"].join(" ")}>
                    <p>Sort by: Recent</p>
                    {iconsSVGs.sortIconGrey}
                </div>

                <div className={[styles.filter, "displayFlex alignCenter"].join(" ")}>
                    <p>Filter by</p>
                    {iconsSVGs.filterIconGrey}
                </div>

                {
                    activeTab === "coupons" && <Button onButtonClick={() => setCreatingCoupon(true)} label={"Add New Coupon"} />
                }
            </div>

            <div className={[styles.productsTable]}>
                

                {
                    (fetchedProducts && products.length === 0) && <div className={styles.noProductsDiv}>
                        <div>
                            <svg style={{width: "200px", fill: "gray"}} viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><title/><g id="Shipping"><path d="M79.75,35.54,71,33.17l8.8-2.36a.5.5,0,0,0,0-1L58.67,24.19a.57.57,0,0,0-.26,0L48,27,37.6,24.18a.46.46,0,0,0-.26,0L16.25,29.79a.5.5,0,0,0,0,1l8.8,2.37-8.81,2.36a.5.5,0,0,0,0,1l10.18,2.72V65.65a.49.49,0,0,0,.37.48l21.08,5.65.13,0,.13,0,21.09-5.65a.5.5,0,0,0,.37-.48V39.21l10.16-2.7a.5.5,0,0,0,0-1ZM48,38.28,28.85,33.15l17.7-4.75L48,28l19.15,5.13L49.12,38ZM58.54,25.19l19.15,5.14-8.61,2.3L50.65,27.69l-.72-.19Zm-21.07,0,8.61,2.32L26.92,32.6l-8.61-2.32ZM26.92,33.67l.14,0,19,5.09-8.61,2.31L27.05,38.32h0L18.31,36Zm10.41,8.44h.26l9.91-2.66V63L27.42,57.62V39.45ZM27.42,58.65,47.5,64v6.62L27.42,65.27Zm21.08,12V64l20.09-5.38v6.62Zm20.09-13L48.5,63V39.46l9.9,2.66a.27.27,0,0,0,.13,0h.13l9.93-2.65Zm.5-19.31a.29.29,0,0,0-.13,0L58.54,41.11,49.93,38.8l19.15-5.1L77.69,36Z"/></g></svg>
                        </div>
                        <h4>There are no products here</h4>
                        <p>Use the button below to add products and start selling</p>
                    </div>
                }

                {
                    showUploadProductsButtons && <div className={styles.addProductsButtonsContainer}>
                        <Button label={"Upload your product list"} theme="outline" />
                        <Button label="Add new product" />
                    </div>
                }

                {
                    activeTab !== "coupons" && <table>
                        <thead>
                            <tr className={styles.tableHeader}>
                                <td>Product Image</td>
                                <td>Product Name</td>
                                <td>Qty (in store)</td>
                                <td>Discount %</td>
                                <td>Category</td>
                                <td>Brand</td>
                                <td>Price</td>
                                <td>Prescription</td>
                                <td>Action</td>
                            </tr>
                        </thead>
                    <tbody>
                        

                        

                        {
                            products.map((product, index) => <ProductTableItem mode={mode} addToDelete = {(product_id) => addProductToDelete(product_id) } setEditMode={() => {
                                console.log({mode});
                                if (mode !== "drafts"){
                                    setMode("edit")
                                } else if (mode === "drafts"){
                                    setMode("drafts")
                                }
                            }} setCurrentDrug={(drug) => {
                                setCurrentDrug(drug) 
                                setShowNewProductModal(true)
                            }} product={product} key={product.id} />)
                        }
                    </tbody>
                </table>
                }

                {
                    activeTab === "coupons" && <table>
                    <tbody>
                        <tr className={styles.tableHeader}>
                            <td>Name of Coupon</td>
                            <td>Code</td>
                            <td>Percentage</td>
                            <td>Status</td>
                            <td>Start Date</td>
                            <td>Expiry Date</td>
                            <td>View Details</td>
                        </tr>

                        

                        {
                            coupons.map((couponItem, index) => <CouponItem coupon={couponItem}  key={coupon._id} />)
                        }
                    </tbody>
                </table>
                }

                {
                    loading && <div className={styles.loaderContainer}>
                    <TransparentLoader />
                    </div>
                }
            </div>

        </div>
    )
}

Products.getLayout = function getLayout (page) {
    return <LoggedInLayout>
        {page}
    </LoggedInLayout>
}


export default Products

const ProductTableItem = ({ product, setCurrentDrug, setEditMode, addToDelete, mode }) => {
    const [showMenu, setShowMenu] = useState(false)
    return (
        <tr className={styles.productTableItem}>
            <td className={styles.image}>
                <Image src={product.images[0] ? product.images[0] : drugImage} s width={30} height={50} objectFit='cover' />
            </td>

            <td>
                <p>{product.name ? product.name : "Unavailable"}</p>
            </td>

            <td>
                <p>{product.quantity}</p>
            </td>

            <td>
                <p>{product.discountPercentage ? product.discountPercentage + "%"  : 0 + "%"}</p>
            </td>

            <td>
                <p>{product.classification ? product.classification : "No Category"}</p>
            </td>

            <td>
                <p>{product.brand}</p>
            </td>

            <td>
                <p>{"NGN "+ Number(product.price).toLocaleString()}</p>
            </td>

            <td>
                <p>{product.requires_prescription ? "Yes" : "No"}</p>
            </td>

            <td className={styles.menuCell}>
                <button onClick={() => {
                    setEditMode()
                    setCurrentDrug(product)
                } }>Edit</button>
                
                <span>
                    <button onClick={() => setShowMenu(true)}>. . .</button>

                    {
                        showMenu && <div>
                        <div onClick={() => {
                            setShowMenu(false)
                        }}>
                            {
                                iconsSVGs.sendGreen
                            }
                            <span>Promote this product</span>
                        </div>

                        <div onClick={() => {
                            addToDelete(product._id)
                            setShowMenu(false)
                        }}>
                            {
                                iconsSVGs.binGrey
                            }
                            <span>Delete product</span>
                        </div>
                    </div>
                    }
                </span>
                
            </td>

            
        </tr>
    )
}

const CouponItem = ({ coupon }) => {
    const [showMenu, setShowMenu] = useState(false)

    const getStatusStyle = (status) => {

        if (status === "active"){
            return styles.active
        } else if (status === "expired"){
            return styles.expired
        } else if (status === "draft"){
            return styles.draft
        }
    }

    return (
        <tr className={styles.couponItem}>
            <td className={styles.image}>
                <p>{coupon?.name}</p>
            </td>

            <td>
                <div>
                <div className={styles.couponCode}>
                    <p>{String(coupon?.code).toLocaleUpperCase()}</p>

                    {
                        iconsSVGs.miniGreyClipboard
                    }
                </div>
                </div>
            </td>

            <td>
                <p>{`${coupon?.percentage} %`}</p>
            </td>

            <td>
                <p className={[styles.status, getStatusStyle(coupon?.status.toLowerCase())].join(" ")}>{getCapitalizedString(coupon?.status)}</p>
            </td>

            <td>
                <p>{getLocaleDate(coupon?.start_date)}</p>
            </td>

            <td>
                <p>{getLocaleDate(coupon?.expiry_date)}</p>
            </td>

            <td>
                <div className='displayFlex'>
                    <Button label="Edit" theme={"outline"} />
                    <Button label="View Details" theme={"outline"}  />
                </div>
            </td>

            
        </tr>
    )
}

const DeleteProduct = ({ onCancel, productsToDelete, fetchProducts, mode, deleteDraft }) => {
    const [deleting, setDeleting] = useState("pending")

    const deleteProducts = async (event) => {

        if (mode === "drafts"){
            deleteDraft(productsToDelete[0])
        } else {
            event.preventDefault()
        setDeleting("processing")
        try {
            const token = localStorage.getItem("userToken")
            const deleteProductsRequest = await fetch(`http://localhost:5000/product/${productsToDelete[0]}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                }
            })

            const deleteProductsResponse = await deleteProductsRequest.json()

            if (deleteProductsResponse.success){
                setDeleting("completed")
                fetchProducts()
            } else {
                setDeleting("pending")
            }
        } catch (error) {
            console.log({error});
        }
        }
        
    }

    return (
        <div className={styles.deleteProductContainer}>
            <h3>{mode === "drafts" ? "Deleting Draft" : "Deleting Product"}</h3>
            

            {
                deleting === "pending" && <React.Fragment>
                    <span>You are about to delete this product. This cannot be reversed</span>
                    <form onSubmit={(event) => deleteProducts(event)}>
                        <Button label={mode === "drafts" ? "Delete Draft" : "Delete Product"} />
                    </form>

                    <p onClick={() => onCancel()}>Cancel</p>
            </React.Fragment>
            }

            {
                deleting === "processing" && <Loader />
            }

            {
                deleting === "completed" && <React.Fragment>
                    {
                        iconsSVGs.binGreyLarge
                    }
                <span>Product Deleted</span>

                <p onClick={() => onCancel()}>Close</p>
            </React.Fragment>
            }

            

            

            
        </div>
    )
}