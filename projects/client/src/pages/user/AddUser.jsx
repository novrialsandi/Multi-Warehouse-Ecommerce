import React,{useState} from 'react';
import { api } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { 
    Box, 
    FormControl, 
    FormLabel, 
    Input, 
    FormHelperText, 
    Container, 
    Select, 
    Button, 
    useToast, 
    HStack, 
    InputGroup
} 
from '@chakra-ui/react';

const AddUser = () => {
    const [fullname, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('W_ADMIN');
    
    const navigate = useNavigate();
    const toast = useToast();

    const saveUser = async (e) => {
        e.preventDefault();
        try {
            await api.post(`${process.env.REACT_APP_API_BASE_URL}/auth/users/v1`, {
                fullname, email, password, role
            });
            toast({
                title:"User has been created",
                status:"success",
                duration:3000,
                isClosable:false
            });
            navigate("/user_list");
        } catch (error) {
            toast({
                title:"There is error when input user",
                status:'error',
                duration:3000,
                isClosable:false
            });
            console.log(error);
        }
    }

    return (
        <Container mt={2}>
            <form onSubmit={saveUser}>
                <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input type='text' value={fullname} onChange={(e) => setFullName(e.target.value)} />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Email address</FormLabel>
                    <Input type='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <FormHelperText>We'll never share your email.</FormHelperText>
                </FormControl>
                <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input type='password' placeholder='Password' id='password'
                   value={password} onChange={(e) => setPassword(e.target.value)}/>
                </InputGroup>
              </FormControl>
                <FormControl isRequired>
                    <FormLabel>Role</FormLabel>
                    <Select placeholder='Select Role' value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value={'W_ADMIN'}>Warehouse Admin</option>
                        <option value={'USER'}>User</option>
                    </Select>
                </FormControl>
                <Box mt={2}>
                    <HStack>
                        <Button size={'sm'} w={'20%'} type='submit' colorScheme='twitter'>Save</Button>
                        <Button size={'sm'} w={'20%'} colorScheme='orange' onClick={() => navigate("/user_list")}>Cancel</Button>
                    </HStack>
                </Box>
            </form>
        </Container>
    );
}

export default AddUser;
