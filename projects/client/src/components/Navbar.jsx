import React from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Image,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  useToast
} from '@chakra-ui/react';
import {FiLogOut, FiLogIn} from "react-icons/fi";
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, reset} from '../redux/authSlice';
import Logo from "../assets/Logo.png";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user} = useSelector((state) => state.auth);
  const toast = useToast();

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    toast({
      title:"Anda berhasil logout",
      status:'success',
      position:'top-right',
      duration: 3000,
      isClosable: false
    });
    navigate("/login");
  };

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box>
              <Image
              src={Logo}
              minW={'50px'}
              w={'20px'}>
              </Image>
            </Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
                <Flex><Link to={'/'}>Dashboard</Link></Flex>
                <Flex><Link to={'/products'}>Products</Link></Flex>
                  {user && user.role === "ADMIN" && (
                    <Flex><Link to={'/users'}></Link>Users</Flex>
                  )};
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Menu>
              <Text mr={2}>Welcome <Text as={'b'}>{user && user.fullname}</Text></Text>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                  size={'sm'}
                  src={
                    'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                />
              </MenuButton>
              <MenuList>
                <MenuItem>
                <Button size={'sm'} variant={'ghost'} leftIcon={<FiLogIn/>}>Login</Button></MenuItem>
                <MenuDivider />
                <MenuItem>
                <Button onClick={logout} size={'sm'} variant={'ghost'} leftIcon={<FiLogOut/>}>Logout</Button>
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              <Text>Dashboard</Text>
              <Text><Link to={'/products'}>Products</Link></Text>
              {user && user.role === "ADMIN" && (
                <Flex><Link to={'/users'}></Link>Users</Flex>
              )};
            </Stack>
          </Box>
        ) : null}
      </Box>

      <Box p={4}>Main Content Here</Box>
    </>
  );
}