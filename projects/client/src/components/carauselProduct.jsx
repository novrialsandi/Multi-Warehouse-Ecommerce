import { useState, useEffect } from "react";
import { Box, IconButton, useBreakpointValue } from "@chakra-ui/react";
// Here we have used react-icons package for the icons
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
// And react-slick as our Carousel Lib
import Slider from "react-slick";

// Settings for the slider
const settings = {
	dots: true,
	arrows: false,
	fade: true,
	infinite: true,
	slidesToShow: 1,
	slidesToScroll: 1,
};

export default function CarouselProduct({ product }) {
	// As we have used custom buttons, we need a reference variable to
	// change the state
	const [slider, setSlider] = useState(<Slider />);
	const [productImage, setProductImage] = useState([]);

	useEffect(() => {
		productImgMap();
	}, []);

	async function productImgMap() {
		const productImg = product.product_images.map((val) =>
			setProductImage(val.product_image)
		);
	}

	// These are the breakpoints which changes the position of the
	// buttons as the screen size changes
	const top = useBreakpointValue({ base: "90%", md: "50%" });
	const side = useBreakpointValue({ base: "30%", md: "10px" });

	// These are the images used in the slide
	const cards = [
		"https://images.unsplash.com/photo-1612852098516-55d01c75769a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
		"https://images.unsplash.com/photo-1627875764093-315831ac12f7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
		"https://images.unsplash.com/photo-1571432248690-7fd6980a1ae2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDl8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
	];
	// const productImage = product.product_images.map((val) => val.product_image);
	// console.log(product.product_images);

	return (
		<Box
			position={"relative"}
			height={"600px"}
			w={"100%"}
			maxWidth={"900px"}
			overflow={"hidden"}
			minW={"450px"}
		>
			{/* CSS files for react-slick */}
			<link
				rel="stylesheet"
				type="text/css"
				charSet="UTF-8"
				href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
			/>
			<link
				rel="stylesheet"
				type="text/css"
				href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
			/>
			{/* Left Icon */}
			<IconButton
				aria-label="left-arrow"
				colorScheme="blackAlpha"
				borderRadius="full"
				position="absolute"
				left={side}
				top={top}
				transform={"translate(0%, -50%)"}
				zIndex={2}
				onClick={() => slider?.slickPrev()}
			>
				<BiLeftArrowAlt />
			</IconButton>
			{/* Right Icon */}
			<IconButton
				aria-label="right-arrow"
				colorScheme="blackAlpha"
				borderRadius="full"
				position="absolute"
				right={side}
				top={top}
				transform={"translate(0%, -50%)"}
				zIndex={2}
				onClick={() => slider?.slickNext()}
			>
				<BiRightArrowAlt />
			</IconButton>
			{/* Slider */}
			<Slider {...settings} ref={(slider) => setSlider(slider)}>
				{cards.map((url, index) => (
					<Box
						key={index}
						height={"6xl"}
						position="relative"
						backgroundPosition="center"
						backgroundRepeat="no-repeat"
						backgroundSize="cover"
						backgroundImage={`url(${url})`}
					/>
				))}
			</Slider>
		</Box>
	);
}
