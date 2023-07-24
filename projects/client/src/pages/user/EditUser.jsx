import React,{useState, useEffect} from 'react';
import { api } from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FormControl, 
  FormLabel, 
  Input, 
  Modal, 
  Button, 
  useToast, 
  FormHelperText,
  InputGroup,
  Select, 
  ModalHeader, 
  ModalContent, 
  ModalCloseButton, 
  ModalBody, 
  ModalFooter } from '@chakra-ui/react';

export default function EditUser (props) {
  const [users, setUsers] = useState({
    name: "",
    email: "",
    password: "",
    verified: true,
    role: "",
  });
    console.log(users);
    const navigate = useNavigate();
    const toast = useToast();
  
    useEffect(() => {
      if (props.id){
        getUserById();
        console.log(props.id);
      }
    }, [props.id]);

    console.log(props.id);
  
    const updateUser = async () => {
      try {
        await api.patch(`${process.env.REACT_APP_API_BASE_URL}/auth/users/${props.id}`, users);
        toast({
          title: "User has been updated",
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: false,
        });
        navigate("/user_list");
        props.fetchData();
        props.onClose();
      } catch (error) {
        toast({
          title: "There is an error when updating the user",
          status: "error",
          duration: 3000,
          position: "top",
          isClosable: false,
        });
        console.log(error);
      }
    };
  
    const getUserById = async () => {
      try {
        const response = await api.get(`${process.env.REACT_APP_API_BASE_URL}/auth/users/${props.id}`);
        setUsers(response.data);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error fetching user details",
          status: "error",
          duration: 3000,
          position: "top",
          isClosable: false,
        });
        console.log(error);
      }
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setUsers((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    return (
      <>
      <Modal isOpen = {props.isOpen} onClose={props.onClose}>
        <ModalContent>
            <ModalHeader>Edit</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
            <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input type='text' name="fullname"
                    value={users.fullname}
                    onChange={handleInputChange}/>
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Email address</FormLabel>
                    <Input type='email' name="email"
                    value={users.email}
                    onChange={handleInputChange}/>
                    <FormHelperText>We'll never share your email.</FormHelperText>
                </FormControl>
                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input  type="password"
                    name="password"
                    placeholder="Password"
                    readOnly={true}
                    id="password"
                    onChange={handleInputChange}
                    />
                  </InputGroup>
                </FormControl>
              <FormControl isRequired>
                    <FormLabel>Verified</FormLabel>
                    <Select placeholder='Select Role' name="verified" defaultValue={users.verified} onChange={handleInputChange}>
                        <option value={true}>Verified</option>
                        <option value={false}>Unverified</option>
                    </Select>
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Role</FormLabel>
                    <Select placeholder='Select Role' name='role' defaultValue={users.role} onChange={handleInputChange}>
                        <option value={'W_ADMIN'}>Warehouse Admin</option>
                        <option value={'USER'}>User</option>
                    </Select>
                </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={() => updateUser()}>
                Save
              </Button>
              <Button colorScheme='orange' onClick={props.onClose}>Cancel</Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
      </>
    );
  };
  