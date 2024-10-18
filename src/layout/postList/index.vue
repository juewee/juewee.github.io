<template>
    <div class="container">
        <div class="post-item chunk" v-for="item in postList" :key="item.post_id">
            <h1>{{item.title}}</h1>
            <p>{{item.content}}</p>
        </div>
    </div>
</template>

<script setup>
    const postList =[
        {
            post_id:1,
            title:'标题1',
            content:'内容1'
        },
        {
            post_id:2,
            title:'标题2',
            content:'内容2'
        },
        {
            post_id:3,
            title:'标题3',
            content:'内容3'
        },
        {
            post_id:1,
            title:'标题1',
            content:'内容1'
        },
        {
            post_id:2,
            title:'标题2',
            content:'内容2'
        },
        {
            post_id:3,
            title:'标题3',
            content:'内容3'
        }
    ]
</script>

<style lang="scss" scoped>
.container{
    width: 800px
}
.post-item{
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}
</style>