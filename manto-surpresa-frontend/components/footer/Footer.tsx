export default function Footer() {
  return (
    <footer className="flex w-[100%] bg-primary text-white py-6 items-center justify-center text-center text-sm text-white/70">
          © {new Date().getFullYear()} Manto Surpresa.
          Todos os direitos reservados.
    </footer>
  );
}