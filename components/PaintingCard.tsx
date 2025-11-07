type Props = { image: string };

export default function PaintingCard({ image }: Props) {
  return (
    <div className="w-full flex justify-center mb-4">
      <img
        src={image}
        alt="Painting"
        className="max-h-[400px] rounded shadow"
      />
    </div>
  );
}
