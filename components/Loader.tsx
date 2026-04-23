export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
      <p className="text-green-600 font-medium">
        Cargando productos...
      </p>
    </div>
  );
}