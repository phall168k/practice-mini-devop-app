<script setup lang="ts"> 
    interface IUser {
        username: string;
        password: string;
        isActive: boolean;
    }

    interface IUsers {
        id: number;
        username: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }
    const formData = ref<IUser>({
        username: '',
        password: '',
        isActive: true,
    });

    const users = ref<IUsers[]>([]);

    const loading = ref<boolean>(true);
    const handleGetUsers = async () => {
        loading.value = true;
        try {
            const response = await $fetch<IUsers[]>(`${config.public.baseUrl}/v1/admin/users`);
            users.value = response;
        } catch (error) {
            console.log(error);
        } finally {
            loading.value = false;
        }
    }

    const config = useRuntimeConfig();

    const handleSubmit = async() => {
        try {
            const response = await $fetch(`${config.public.baseUrl}/v1/admin/users`, {
                method: 'POST',
                body: formData.value,
            });
            console.log(response);
            handleGetUsers();
        } catch (error) {
            console.log(error);
        }
    }

    onMounted(() => {
        handleGetUsers();
    });
</script>

<template>
    <h1>User Managements</h1>
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
    <div></div>
    <hr/>
    <div>
        <div v-if="loading">Loading...!</div>
        <div v-else>
            <div v-if="users.length > 0">
                <div v-for="item in users" :key="item.id">
                    <h1>{{ item.username }}</h1>
                    <h2>{{ item.isActive }}</h2>
                    <h2>{{ item.createdAt }}</h2>
                    <h2>{{ item.updatedAt }}</h2>
                    <h2>{{ item.deletedAt }}</h2>
                    <hr/>
                </div>
            </div>
        </div>
    </div>
</template>