<template>
  <div class="k-logo">
    <div class="k-letter">K</div>
  </div>
</template>

<style scoped>
.k-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.k-letter {
  color: #4A148C; /* Dark purple */
  font-size: 2rem;
  font-weight: bold;
  font-family: 'Arial', sans-serif;
}

/* Responsive sizing */
@media (max-width: 600px) {
  .k-logo {
    width: 50px;
    height: 50px;
  }
  
  .k-letter {
    font-size: 1.5rem;
  }
}
</style>