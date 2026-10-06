<script setup lang="ts"> 
    interface IUser {
        username: string;
        password: string;
        isActive: boolean;
    }
    const formData = ref<IUser>({
        username: '',
        password: '',
        isActive: true,
    });

    const config = useRuntimeConfig();

    const handleSubmit = async() => {
        try {
            const response = await $fetch(`${config.public.baseUrl}/v1/admin/users`, {
                method: 'POST',
                body: formData.value,
            });
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }
</script>

<template>
    <form @submit.prevent="handleSubmit">

        <div>
            <label>Username</label>
            <input v-model="formData.username" type="text" placeholder="Username"/>
        </div>
        <div>
            <label>Password</label>
            <input v-model="formData.password" type="password" placeholder="Password"/>
        </div>
        <div>
            <button type="submit">Save</button>
        </div>
    </form>
</template>