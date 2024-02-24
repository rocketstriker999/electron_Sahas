import { requestHelper } from './helper.js';

let purchaseHandler = {};

purchaseHandler.courseImage = document.getElementById("COURSE_IMG");
purchaseHandler.courseName = document.getElementById("COURSE_NAME");
purchaseHandler.courseDescription = document.getElementById("COURSE_DESCRIPTION");
purchaseHandler.courseSubjects = document.getElementById("COURSE_SUBJECTS");
purchaseHandler.courseOriginalPrice = document.getElementById("COURSE_ORIGINAL_PRICE");
purchaseHandler.coursePurchaseError = document.getElementById("COURSE_PURCHASE_ERROR");
purchaseHandler.courseDiscount = document.getElementById("COURSE_DISCOUNT");
purchaseHandler.coursePayPrice = document.getElementById("COURSE_PRICE_PAY");
purchaseHandler.etxCoupon = document.getElementById("ETX_COUPON");
purchaseHandler.containerPayu = document.getElementById("CONTAINER_PAYU");
purchaseHandler.formPayu = document.getElementById("FORM_PAYU");
purchaseHandler.btnClosePayu = document.getElementById("BTN_CLOSE_SHEET");

purchaseHandler.btnBack = document.getElementById("BTN_BACK");
purchaseHandler.btnPurchaseCourse = document.getElementById("BTN_BUY");

//extract and generate get object passed from dashboard
purchaseHandler.course = Object.fromEntries(new URLSearchParams(window.location.search));
//Set Image For Course
purchaseHandler.courseImage.src = `${requestHelper.serverAddress}/thumbnails/${purchaseHandler.course.std_image}`;
//set name
purchaseHandler.courseName.innerHTML = purchaseHandler.course.std_name;
//set description
purchaseHandler.courseDescription.innerHTML = purchaseHandler.course.std_desc;
//set number of subject
purchaseHandler.courseSubjects.innerHTML = `${purchaseHandler.course.sub_count} Subjects`;
//Set Course Price
purchaseHandler.courseOriginalPrice.innerHTML = `Course Price : ${purchaseHandler.course.std_price}.rs`;
//Set Same Course Price To Pay
purchaseHandler.course.pricePay = purchaseHandler.course.std_price;
purchaseHandler.course.discount = 0;
purchaseHandler.coursePayPrice.innerHTML = `Price To Pay : ${purchaseHandler.course.pricePay}.rs`;

//Open Purchase Flow
purchaseHandler.btnPurchaseCourse.addEventListener("click", (e) => {

    //Get User Info
    window.electron.getCurrentUser((currentUser) => {

        if (currentUser.user_wallet >= purchaseHandler.course.pricePay) {
            //Direct Purchase
            //Deduct Money From Wallet
            currentUser.user_wallet -= purchaseHandler.course.pricePay;

            requestHelper.requestServer({
                requestPath: "purchaseCourse.php", requestMethod: "POST", requestPostBody: {
                    std_name: purchaseHandler.course.std_name,
                    course_amount: purchaseHandler.course.pricePay,
                    user_email: currentUser.user_email,
                    user_ref_email: "N/A",
                    purchase_inst: "N/A",
                    purchase_address: "N/A",
                    purchase_land: "N/A",
                    purchase_city: "N/A",
                    user_new_wallet: currentUser.user_wallet,
                    is_combo: purchaseHandler.course.is_combo,
                    referal_code: purchaseHandler.etxCoupon.value ? purchaseHandler.etxCoupon.value : "-",
                }
            }).then(response => response.json()).then(jsonResponse => {
                if (jsonResponse.isTaskSuccess == "true") {
                    //Go Back To Course Page
                    window.electron.back();
                }
                else {
                    //Set Transcation Fail Error
                    purchaseHandler.setPurchaseError(jsonResponse.response_msg);
                }
            }).catch(error => {
                //Set Transcation Fail Error
                purchaseHandler.setPurchaseError(error);
            });
        }
        else {
            //Open Payu Money Gateway
            purchaseHandler.requestForHash(currentUser);
        }
    });
});

purchaseHandler.requestForHash = (currentUser) => {

    //prod key 3ErnOi0i
    //test key gtKFFx


    purchaseHandler.course.transactionId= Date.now();
    purchaseHandler.course.vendorKey= "3ErnOi0i";

    console.log(purchaseHandler.course.id);

    requestHelper.requestServer({
        requestPath: "getPaymentHash.php", requestMethod: "POST", requestPostBody: {
            desktop_app: "desktop_app",
            key: purchaseHandler.course.vendorKey,
            txnid:purchaseHandler.course.transactionId ,
            amount: purchaseHandler.course.pricePay,
            productinfo: purchaseHandler.course.id,
            firstName: currentUser.user_name,
            email: currentUser.user_email,
            udf1: purchaseHandler.course.combo_id,
            udf2: purchaseHandler.etxCoupon.value,
        }
    }).then(response => response.json()).then(jsonResponse => {

        //request for hash 
        if (jsonResponse.isTaskSuccess == "true") {
            //open the payment details container and continue with it
            purchaseHandler.containerPayu.style.left = 0;
            //show form to submit details and redirect to payment gateway
            //test key - gtKFFx 
            //salt -> eCwWELxi
            purchaseHandler.formPayu.innerHTML = `
            <h4 class="title_secondary">Payment Details</h4>
            <input type="hidden" name="key" value="${purchaseHandler.course.vendorKey}" />
            <input type="hidden" name="txnid" value="${purchaseHandler.course.transactionId}" />
            <input type="hidden" name="surl" value="https://sahasinstitute.com/adminportal/mobileApis/payu.php" />
            <input type="hidden" name="furl" value="https://sahasinstitute.com/adminportal/mobileApis/payu.php" />
            <input type="hidden" name="hash" value="${jsonResponse.paymentHash}" />
            <input type="hidden" name="productinfo" value="${purchaseHandler.course.id}" />

            <input type="hidden" name="udf1" value="${purchaseHandler.course.combo_id}" />
            <input type="hidden" name="udf2" value="${purchaseHandler.etxCoupon.value}" />


            <div class="container_input margin_top">
                <i class="icon_edittext fa-brands fa-product-hunt" aria-hidden="true"></i>
                <input class="edittext edittext_disable" value="${purchaseHandler.course.std_name}" readonly  required/>
            </div>

            <div class="container_input margin_top">
                <i class="icon_edittext fa-solid fa-indian-rupee-sign" aria-hidden="true"></i>
                <input class="edittext edittext_disable" name="amount" value="${purchaseHandler.course.pricePay}" readonly  required/>
            </div>

            <div class="container_input margin_top">
                <i class="icon_edittext fas fa-envelope" aria-hidden="true"></i>
                <input class="edittext edittext_disable" name="email" value="${currentUser.user_email}" readonly  required/>
            </div>

            <div class="container_input margin_top">
                <i class="icon_edittext fas fa-user" aria-hidden="true"></i>
                <input class="edittext edittext_disable" name="firstname" value="${currentUser.user_name}" readonly required />
            </div>

            <div class="container_input margin_top">
                <i class="icon_edittext fa fa-phone" aria-hidden="true"></i>
                <input class="edittext" name="phone" type="tel" maxlength="10" placeholder="Phone number" pattern="[789][0-9]{9}" oninvalid="this.setCustomValidity('Invlid Phone Number')"  required/>
            </div>
            
            <input type="submit" class="margin_top btn_pink" value="Continue">`
        }
        else {
            purchaseHandler.setPurchaseError(jsonResponse.response_msg);
        }


    }).catch(error => {
        purchaseHandler.setPurchaseError(error);
    });

}

purchaseHandler.setPurchaseError = (error) => {
    purchaseHandler.coursePurchaseError.style.display = "block";
    purchaseHandler.coursePurchaseError.innerHTML = `Transcation Has Failed ${error}`;
}

purchaseHandler.btnClosePayu.addEventListener("click", (e) => {
    purchaseHandler.containerPayu.style.left = '100vw'
});

purchaseHandler.setCuoponCodeError = (error) => {
    purchaseHandler.error.style.display = "block";
    purchaseHandler.error.innerHTML = error;
}

purchaseHandler.handleCouponCode = (e) => {
    if (e.target.value.length > 2) {
        requestHelper.requestServer({
            requestPath: "validateReferalCode.php", requestMethod: "POST", requestPostBody: {
                referal_code: purchaseHandler.etxCoupon.value,
                std_name: purchaseHandler.course.std_name,
                course_original_price: purchaseHandler.course.std_price
            }
        }).then(response => response.json()).then(jsonResponse => {
            purchaseHandler.course.discount = (jsonResponse.isTaskSuccess == "true" && jsonResponse.referal_discount > 0) ? jsonResponse.referal_discount : 0;
            purchaseHandler.updatePayPrice()
        }).catch(error => {
            purchaseHandler.course.discount = 0;
            purchaseHandler.updatePayPrice()
        });
    }
}

purchaseHandler.updatePayPrice = () => {

    if (purchaseHandler.course.discount > 0) {
        purchaseHandler.etxCoupon.classList.add("promo_success")
        purchaseHandler.courseDiscount.style.display = 'block';
        purchaseHandler.courseDiscount.innerHTML = `Applied Discount : -${(purchaseHandler.course.std_price * purchaseHandler.course.discount / 100)} rs (${purchaseHandler.course.discount}%)`;
        purchaseHandler.course.pricePay = purchaseHandler.course.std_price - (purchaseHandler.course.std_price * purchaseHandler.course.discount / 100)
    }
    else {
        purchaseHandler.etxCoupon.classList.remove("promo_success")
        purchaseHandler.courseDiscount.style.display = 'none';
        purchaseHandler.course.pricePay = purchaseHandler.course.std_price;
    }
    purchaseHandler.coursePayPrice.innerHTML = `Price To Pay : ${purchaseHandler.course.pricePay}.rs`;
}

//on coupon code text change
purchaseHandler.etxCoupon.addEventListener("keyup", purchaseHandler.handleCouponCode);
purchaseHandler.etxCoupon.addEventListener("change", purchaseHandler.handleCouponCode);
purchaseHandler.etxCoupon.addEventListener("paste", purchaseHandler.handleCouponCode);

//Back Button Click
purchaseHandler.btnBack.addEventListener("click", (e) => {
    window.electron.back();
});