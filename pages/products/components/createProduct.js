import React, { useRef, useState } from 'react';
import { iconsSVGs } from '../../../assets/images/icons';
import Button from '../../../components/atoms/Button';
import DropDown from '../../../components/atoms/DropDown';
import TextInput from '../../../components/atoms/textInput';
import DatePicker from '../../../components/molecules/DatePicker';
import LabeledTextInput from '../../../components/molecules/LabeledTextInput';
import styles from "./../styles/styles.module.css";
import imagePlaceholder from "../../../assets/images/imagePlaceholder.png"
import Image from 'next/image';

const CreateProduct = ({closeModal}) => {
    const [currentTab, setCurrentTab] = useState(0)

    const toPreviousTab = () => {
        if (currentTab > 0){
            setCurrentTab(currentTab - 1)
        }
    }

    const toNextTab = () => {
        if (currentTab < 3){
            setCurrentTab(currentTab + 1)
        }
    }

    return (
        <div className='displayFlex'>
                    <div className={styles.createProductModal}>
                        <header className='displayFlex'>
                            <p className={currentTab === 0 ? styles.activeTab : styles.inactiveTab}>Product Info</p>
                            <p className={currentTab === 1 ? styles.activeTab : styles.inactiveTab}>More Product Details</p>
                            <p className={currentTab === 2 ? styles.activeTab : styles.inactiveTab}>Product Pricing</p>
                            <p className={currentTab === 3 ? styles.activeTab : styles.inactiveTab}>Images</p>
                        </header>


                        {
                            currentTab === 0 && <ProductInfo />
                        }

                        {
                            currentTab === 1 && <MoreProductDetails />
                        }

                        {
                            currentTab === 2 && <ProductPricing />
                        }

                        {
                            currentTab === 3 && <Images />
                        }
                        

                        <hr />

                        <footer className='pl40 pr40 displayFlex jcEnd pt10 pb10'>
                            {
                                currentTab !== 0 && <Button theme={"outline"} label={"Previous"} onClicked={() => toPreviousTab()} />
                            }
                            <Button theme={"solid"} label={currentTab === 3 ? "Submit & Finish" : "Next"} onClicked={() => toNextTab()} />
                        </footer>
                    </div>

                    <div onClick={() => closeModal()}>
                    {iconsSVGs.closeIconWhite}
                    </div>

                    
                    
                </div>
    )
}

const ProductInfo = () => {
    return (
        <div className={styles.pageContent}>

            <h2>CREATE NEW PRODUCT</h2>

            <LabeledTextInput label={"Product Name*"}>
                <DropDown options={[]} placeholder={"MELOFAN PLUS"} />
            </LabeledTextInput>

            <div className='displayFlex jcSpaceBetween horizontalHalf pb20 pt20'>
                <LabeledTextInput label={"Presentation"}>
                    <DropDown options={[]} placeholder={"Tablets"} />
                </LabeledTextInput>

                <LabeledTextInput label={"Brand"}>
                    <TextInput placeholder={"Active Ingredient*"} />
                </LabeledTextInput>
            </div>

            <div className='displayFlex jcSpaceBetween horizontalHalf pb20'>
                <LabeledTextInput label={"Applicant Name"}>
                    <TextInput placeholder={"CLARION MEDICALS LIMITED"} />
                </LabeledTextInput>

                <LabeledTextInput label={"Country"}>
                    <TextInput placeholder={"CLARION MEDICALS LIMITED"} />
                </LabeledTextInput>
            </div>

            <div className='displayFlex jcSpaceBetween horizontalHalf pb20'>
                <LabeledTextInput label={"Manufacturer"}>
                    <TextInput placeholder={"CLARION MEDICALS LIMITED"} />
                </LabeledTextInput>

                <LabeledTextInput label={"Date Approved"}>
                    <TextInput placeholder={"CLARION MEDICALS LIMITED"} />
                </LabeledTextInput>
            </div>

            <LabeledTextInput label={"Registration Number"}>
                    <TextInput placeholder={"CLARION MEDICALS LIMITED"} />
                </LabeledTextInput>

        </div>
    )
}

const MoreProductDetails = () => {
    return (
        <div className={styles.pageContent}>
            <h2>More Product Details</h2>

            <div className='displayFlex jcSpaceBetween horizontalHalf'>
            <LabeledTextInput label={"Product Description *"}>
                <TextInput type={"textarea"} />
                <p className={styles.infoText}>The product description should give the customer useful information about the product to ensure a purchase. </p>
            </LabeledTextInput>

            <LabeledTextInput label={"Highlights *"}>
                <TextInput type={"textarea"} />
                <p className={styles.infoText}>Enter short major highlights of the product, to make the purchase decision for the customer easier. Paste http://bit.ly/3ahLVGX into your browser for more information</p>
            </LabeledTextInput>
            </div>

            <div className='displayFlex jcSpaceBetween horizontalHalf'>
            <LabeledTextInput label={"What's in the box"}>
                <TextInput type={"textarea"} />
                <p className={styles.infoText}>Short summary/list of the package content, which the customer gets.</p>
            </LabeledTextInput>

            <LabeledTextInput label={"Active Ingredients"}>
                <TextInput type={"textarea"} />
                <p className={styles.infoText}>Possibility to enter some comments or additional information about the product. Example: Choking Hazard: Not for children under 3 years</p>
            </LabeledTextInput>
            </div>
        </div>
    )
}

const ProductPricing = () => {
    return (
        <div className={styles.pageContent}>
            <h2>PRODUCT PRICING</h2>

            <div className='displayFlex jcSpaceBetween horizontalHalf'>
                <LabeledTextInput label={"Sales Price"}>
                    <TextInput  />
                </LabeledTextInput>

                <LabeledTextInput label={"Quantity"}>
                    <TextInput  />
                </LabeledTextInput>
            </div>

            <div className='displayFlex jcSpaceBetween horizontalHalf pt20'>
                <LabeledTextInput label={"DiscountPrice"}>
                    <span className={styles.discount}>
                        <input placeholder='%' />
                        <div>
                            N
                        </div>
                    </span>
                </LabeledTextInput>

                <LabeledTextInput label={"Select Coupon Code"}>
                    <DropDown options={[]} placeholder={"Health Week"} />
                </LabeledTextInput>
            </div>

            <div className='displayFlex jcSpaceBetween horizontalHalf pt20'>
                <LabeledTextInput label={"Sale Start Date"}>
                    <DatePicker />
                </LabeledTextInput>

                <LabeledTextInput label={"Sale End Date"}>
                    <DatePicker />
                </LabeledTextInput>
            </div>
        </div>
    )
}

const Images = () => {
    return (
        <div className={styles.pageContent}>
            <h2>PRODUCT IMAGES</h2>

            <div className='displayFlex jcSpaceBetween horizontalThird'>
                <ImageSelectorItem />
                <ImageSelectorItem />
                <ImageSelectorItem />
            </div>

            <div className='displayFlex jcSpaceBetween horizontalThird pt20'>
                <ImageSelectorItem />
                <ImageSelectorItem />
                <ImageSelectorItem />
            </div>
        </div>
    )
}

const ImageSelectorItem = () => {
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
            console.log(srcData);
            // onFileSelect(fileToLoad)
          };
    
          fileReader.readAsDataURL(fileToLoad);
        }
      };

    return (
        <div className={styles.imageSelector}>
            <Image src={currentImage} width={100} height={100} objectFit='covers' />

            <p>{"Drag & Drop your file"}</p>

            <Button label={"Browse To Upload"} onClicked={() => {
                fileSelectorRef.current.click()
            }} />

            <input type={"file"} ref={fileSelectorRef} 
                onChange={(picSelector) => {
                encodeImageFileAsURL();
                var reader = new FileReader();
              
                reader.onload = function (e) {
                // get loaded data and render thumbnail.

                setCurrentImage(e.target.result)
              
                console.log(e.target.result);
                };
              
                // read the image file as a data URL.
                reader.readAsDataURL(picSelector.target.files[0]);
                }}
            />
        </div>
    )
}

export default CreateProduct