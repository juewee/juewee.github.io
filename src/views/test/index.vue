<template>
    <div class="container">
        <div class="grid-card">
            <div class="item a">111</div>
            <div class="item b">11</div>
            <div class="item c">111</div>
        </div>
    </div>

</template>
<style scoped lang="scss">
.container {
    width: 100vw;
    height: 100vh;
    background-color: red;
    display: flex;
    justify-content: center;
    align-items: center;
}

.grid-card {
    display: grid;
    width: 700px;
    height: 600px;
    grid-template-columns: 1fr 1fr 1.5fr;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 8px 8px;
    grid-auto-flow: row;
    grid-template-areas:
        "a a b"
        "a a b"
        "c c c";
}

.item{
    border-radius: 8px;
    box-shadow: var(--el-box-shadow);
}

.a {
    grid-area: a;
}

.b {
    grid-area: b;
}

.c {
    grid-area: c;
}
</style>