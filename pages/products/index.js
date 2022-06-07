import Head from 'next/head';
import React, { useState } from 'react';
import { iconsSVGs } from '../../assets/images/icons';
import LoggedInLayout from '../../components/layouts/LoggedInLayout/loggedinLayout';
import styles from "./styles/styles.module.css";
import drugImage from "../../public/drug.png";
import Image from 'next/image';
import Modal from '../../components/layouts/Modal';
import CreateProduct from './components/createProduct';

const Products = () => {
    const [activeTab, setActiveTab] = useState("all")
    const [showNewProductModal, setShowNewProductModal] = useState(false)
    return (
        <div className={styles.products}>
            <Head>
                <title>Products | Dawomed</title>
            </Head>

            {
                showNewProductModal && <Modal>
                    <CreateProduct closeModal={() => setShowNewProductModal(false)} />
                </Modal>
            }
            
            <header className='displayFlex'>
                <div className={styles.headerOptions}>
                    <div className='displayFlex alignCenter' onClick={() => setShowNewProductModal(true)} >
                        {iconsSVGs.addIconLightPrimary}
                        <p>Add Product</p>
                    </div>

                    <div className='displayFlex alignCenter'>
                        {iconsSVGs.downloadLightPrimary}
                        <p>Import Product</p>
                        {iconsSVGs.dropCaretGrey}
                    </div>
                </div>

                <div className={[styles.headerTabs, 'displayFlex'].join("  ")}>
                    <p className={activeTab === "all" ? styles.active : styles.inactive} onClick={() => setActiveTab("all")}>All Products</p>

                    <p className={activeTab === "drafts" ? styles.active : styles.inactive} onClick={() => setActiveTab("drafts")}>Drafts</p>

                    <p className={activeTab === "in stock" ? styles.active : styles.inactive} onClick={() => setActiveTab("in stock")}>In Stock</p>

                    <p className={activeTab === "out of stock" ? styles.active : styles.inactive} onClick={() => setActiveTab("out of stock")}>Out of Stock</p>

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
            </div>

            <div className={[styles.productsTable]}>
                <table>
                    <tbody>
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

                        {
                            sampleProducts.map((product, index) => <ProductTableItem product={product} key={product.id} />)
                        }
                    </tbody>
                </table>
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

const ProductTableItem = ({ product }) => {
    return (
        <tr className={styles.productTableItem}>
            <td className={styles.image}>
                <Image src={drugImage} width={30} height={50} objectFit='cover' />
            </td>

            <td>
                <p>{product.productName}</p>
            </td>

            <td>
                <p>{product.quantity}</p>
            </td>

            <td>
                <p>{product.discountPercentage + "%"}</p>
            </td>

            <td>
                <p>{product.category}</p>
            </td>

            <td>
                <p>{product.brand}</p>
            </td>

            <td>
                <p>{"NGN "+ String(product.price).toLocaleLowerCase()}</p>
            </td>

            <td>
                <p>{product.prescription ? "Yes" : "No"}</p>
            </td>

            <td>
                <button>Edit</button>
                <button>. . .</button>
            </td>

            
        </tr>
    )
}

const sampleProducts = [
    {
        productImage: drugImage,
        productName: "Azithromycin",
        quantity: 10,
        discountPercentage: 10,
        category: "Antibiotics",
        brand: "Emzor",
        price: 2500,
        prescription: false,
        rating: 3,
        id: 1
    },

    {
        productImage: drugImage,
        productName: "Diclofenac",
        quantity: 12,
        discountPercentage: 0,
        category: "Painkillers",
        brand: "Emzor",
        price: 2500,
        prescription: false,
        rating: 2,
        id: 2
    },

    {
        productImage: drugImage,
        productName: "Lincosamide",
        quantity: 25,
        discountPercentage: 10,
        category: "Antibiotics",
        brand: "Emzor",
        price: 2500,
        prescription: true,
        rating: 5,
        id: 3
    },

    {
        productImage: drugImage,
        productName: "Azithromycin",
        quantity: 10,
        discountPercentage: 10,
        category: "Antibiotics",
        brand: "Emzor",
        price: 2500,
        prescription: false,
        rating: 3,
        id: 4
    },

    {
        productImage: drugImage,
        productName: "Diclofenac",
        quantity: 12,
        discountPercentage: 0,
        category: "Painkillers",
        brand: "Emzor",
        price: 2500,
        prescription: false,
        rating: 2,
        id: 5
    },

    {
        productImage: drugImage,
        productName: "Lincosamide",
        quantity: 25,
        discountPercentage: 10,
        category: "Antibiotics",
        brand: "Emzor",
        price: 2500,
        prescription: true,
        rating: 5,
        id: 6
    },

    {
        productImage: drugImage,
        productName: "Azithromycin",
        quantity: 10,
        discountPercentage: 10,
        category: "Antibiotics",
        brand: "Emzor",
        price: 2500,
        prescription: false,
        rating: 3,
        id: 7
    },

    {
        productImage: drugImage,
        productName: "Diclofenac",
        quantity: 12,
        discountPercentage: 0,
        category: "Painkillers",
        brand: "Emzor",
        price: 2500,
        prescription: false,
        rating: 2,
        id: 8
    },

    {
        productImage: drugImage,
        productName: "Lincosamide",
        quantity: 25,
        discountPercentage: 10,
        category: "Antibiotics",
        brand: "Emzor",
        price: 2500,
        prescription: true,
        rating: 5,
        id: 9
    }
]