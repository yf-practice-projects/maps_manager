import { Box, Text,Icon, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
import { FiFolder } from "react-icons/fi";


interface props {
	name:string
}

const Folder = ({ name } : props) => {
	const bgColor = useColorModeValue('gray.200', 'gray.700'); // ライトモードとダークモードで背景色を変える
  const hoverBgColor = useColorModeValue('gray.300', 'gray.600');

  return (
		<Link href={`/master/picture/${name}`} >
			<Box
				p={4}
				my={4}
				display="flex"
				alignItems="center"
				bg={bgColor}
				borderRadius="md"
				_hover={{ bg: hoverBgColor }}
				cursor="pointer"
			>
				<Icon as={FiFolder} w={6} h={6} mr={2} />
				<Text fontWeight="bold">{name}</Text>
			</Box>
		</Link>
  );
}

export default Folder