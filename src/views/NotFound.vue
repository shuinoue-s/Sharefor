<template>
  <div class="position-center">
    <p class="font text-center not-found">404 Not Found</p>
    <p class="font text-center text">お探しのページが見つかりませんでした。</p>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
}
</script>

<style>
  @import '../css/style.css';

  .position-center {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 90%;
    transform: translate(-50%, -50%);
  }

  .not-found {
    font-size: 30px;
    color: rgb(120, 120, 120);
  }

  .text {
    font-size: 22px;
    color: rgb(120, 120, 120);
  }
</style>