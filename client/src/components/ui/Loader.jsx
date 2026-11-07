export default function Loader() {
  return (
    <div className="flex justify-center py-24" role="status" aria-label="Loading">
      <div className="h-10 w-10 rounded-full border-4 border-brand/20 border-t-brand animate-spin" />
    </div>
  );
}
